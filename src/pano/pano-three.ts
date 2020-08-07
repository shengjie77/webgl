import * as THREE from 'three';
import { Scene, PerspectiveCamera, BackSide, DoubleSide } from 'three';
import { pano1 } from 'src/resource';
import { JControl, JControlEvent } from 'src/utils/control';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const BACKGROUND = 1;
const MODEL = 2;

export function runPano() {
	const scene = new Scene();
	const camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		10000,
	)

	camera.applyQuaternion(new THREE.Quaternion(-0.000038, -0.982004, -0.188857, 0.0002014));

	const renderer = new THREE.WebGLRenderer({
		alpha: true,
	});
	renderer.setClearColor(0xffffff, 0);
	document.body.append(renderer.domElement);

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1500, {
		format: THREE.RGBAFormat,
		generateMipmaps: true,
		stencilBuffer: false,
	})

	const cameraPosition = new THREE.Vector3(2398, 1300, 479);
	const cubeCamera = new THREE.CubeCamera(0.1, 10000, cubeRenderTarget);
	cubeCamera.position.copy(cameraPosition);
	scene.add(cubeCamera);

	const pano = createPano(() => {
		requestAnimationFrame(render);
	}, cubeRenderTarget.texture);

	bindCamera(camera, document as any);

	// pano.layers.set(BACKGROUND);
	pano.name = 'pano';
	scene.add(pano);

	const model = createModel(new THREE.Vector3(2264, 427, 3148));
	model.name = 'model';
	// model.layers.set(MODEL);
	scene.add(model);

	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(500, 2000, 0);
	scene.add(light);
	
	pano.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

	// camera.layers.enable(MODEL);
	// camera.layers.enable(BACKGROUND);


	// const mat = createCubeMaterial(cubeRenderTarget.texture, () => {}) 

	// const geo = new THREE.BoxGeometry(50, 50, 50);
	// const mesh = new THREE.Mesh(geo, mat);
	// mesh.position.set(2398, 1300, 679);
	// mesh.name = 'box';
	// scene.add(mesh);

	function render(time: number) {
		renderer.setSize(window.innerWidth, window.innerHeight);

		// mesh.visible = false;
		pano.visible = false;
		model.visible = true;
		cubeCamera.update(renderer, scene);

		model.visible = false;
		pano.visible = true;
		// mesh.visible = true;
		renderer.render(scene, camera);

		const angle = time * 0.001;
		model.rotation.x = angle;
		model.rotation.y = angle;

		// mesh.rotation.x = angle;
		// mesh.rotation.y = angle;

		requestAnimationFrame(render);
	}

	window.onresize = () => {
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

function createModel(position: THREE.Vector3) {
	const size = 700;
	const geo = new THREE.BoxGeometry(size, size, size);
	const mat = new THREE.MeshPhongMaterial({
		color: 'red',
		depthTest: false,
	})
	const mesh = new THREE.Mesh(geo, mat);
	mesh.position.set(position.x, position.y, position.z);

	return mesh;
}

function createPano(onLoad: () => void, texture: any) {
	const size = 50;
	const geo = new THREE.BoxGeometry(
		size,
		size,
		size,
	);

	const panoTexture = new THREE.CubeTextureLoader().load(pano1, onLoad);
	// const mat = createPanoMaterial(panoTexture, onLoad);
	const mat = createComposedMaterial(panoTexture, texture);

	const mesh = new THREE.Mesh(geo, mat);

	return mesh;
}

function bindCamera(camera: THREE.PerspectiveCamera, el: HTMLElement) {
	const control = new JControl(el);
	let x = 0;
	let y = 0;
	const euler = new THREE.Euler(0, 0, 0, 'YXZ');
	control.on(JControlEvent.BeforeDrag, (ev) => {
		x = ev.x;
		y = ev.y;
		euler.setFromQuaternion(camera.quaternion);
	})

	control.on(JControlEvent.Drag, (ev) => {
		const deltaX = ev.x - x;
		const deltaY = ev.y - y;

		const ratio = 0.002;
		euler.y += deltaX * ratio;
		euler.x += deltaY * ratio;

		camera.quaternion.setFromEuler(euler);

		x = ev.x;
		y = ev.y;
	})
}

function createPanoMaterial(cubeTexture: any, onLoad: () => void) {
	const vert = `
	varying vec3 v_direction;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		v_direction = vec3(-position.x, position.yz);
	}
	`;

	const frag = `
	uniform samplerCube panoCubeMap;
	varying vec3 v_direction;

	void main() {
		gl_FragColor = textureCube(panoCubeMap, v_direction);
	}
	`;

	const mat = new THREE.ShaderMaterial({
		vertexShader: vert,
		fragmentShader: frag,
		uniforms: {
			panoCubeMap: {
				value: cubeTexture,
			}
		},
		side: THREE.DoubleSide,
	})

	return mat;
}

function createComposedMaterial(cubeTexture: THREE.CubeTexture, foregroundTexture: any) {
	const vert = `
	varying vec3 v_direction;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		v_direction = vec3(-position.x, position.yz);
	}
	`;

	const frag = `
	uniform samplerCube panoCubeMap;
	uniform samplerCube foregroundCubeMap;

	varying vec3 v_direction;

	void main() {
		vec4 bgColor = textureCube(panoCubeMap, v_direction);
		vec4 fgColor = textureCube(foregroundCubeMap, vec3(-v_direction.x, v_direction.yz));
		vec3 composedColor = vec3(bgColor.rgb) * (1.0 - fgColor.a) + vec3(fgColor.rgb);
		gl_FragColor = vec4(composedColor.rgb, 1.0);
	}
	`;

	const mat = new THREE.ShaderMaterial({
		vertexShader: vert,
		fragmentShader: frag,
		uniforms: {
			panoCubeMap: {
				value: cubeTexture,
			},
			foregroundCubeMap: {
				value:foregroundTexture,
			},
		},
		side: THREE.DoubleSide,
	})

	return mat;
}

function createCubeMaterial(cubeTexture: any, onLoad: () => void) {
	const vert = `
	varying vec3 v_direction;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		v_direction = vec3(-position.x, position.yz);
	}
	`;

	const frag = `
	uniform samplerCube panoCubeMap;
	varying vec3 v_direction;

	void main() {
		gl_FragColor = textureCube(panoCubeMap, v_direction);
	}
	`;

	const mat = new THREE.ShaderMaterial({
		vertexShader: vert,
		fragmentShader: frag,
		uniforms: {
			panoCubeMap: {
				value: cubeTexture,
			}
		},
		side: THREE.DoubleSide,
		depthTest: false,
	})

	return mat;
}