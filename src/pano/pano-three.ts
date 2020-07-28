import * as THREE from 'three';
import { Scene, PerspectiveCamera } from 'three';
import { pano1 } from 'src/resource';
import { JControl, JControlEvent } from 'src/utils/control';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export function runPano() {
	const scene = new Scene();
	scene.background = new THREE.Color('white');
	const camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		10000,
	)

	camera.applyQuaternion(new THREE.Quaternion(-0.000038, -0.982004, -0.188857, 0.0002014));

	const renderer = new THREE.WebGLRenderer();
	document.body.append(renderer.domElement);

	const pano = createPano(() => {
		requestAnimationFrame(render);
	});

	bindCamera(camera, document as any);

	scene.add(pano);
	const model = createModel(new THREE.Vector3(2264, 427, 3148));
	scene.add(model);

	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(500, 2000, 0);
	scene.add(light);
	
	const cameraPosition = new THREE.Vector3(2398, 1300, 479);
	pano.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
	camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

	function render(time: number) {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);

		const angle = time * 0.001;
		model.rotation.x = angle;
		model.rotation.y = angle;

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

function createPano(onLoad: () => void) {
	const size = 50;
	const geo = new THREE.BoxGeometry(
		size,
		size,
		size,
	);

	// const mats = pano1.map(url => {
	// 	const loader = new THREE.TextureLoader();
	// 	const texture = loader.load(url);
	// 	return new THREE.MeshBasicMaterial({
	// 		map: texture,
	// 		side: THREE.BackSide,
	// 	})
	// })

	const mat = createPanoMaterial();
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

function createPanoMaterial() {
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

	const texture = new THREE.CubeTextureLoader().load(pano1);
	const mat = new THREE.ShaderMaterial({
		vertexShader: vert,
		fragmentShader: frag,
		uniforms: {
			panoCubeMap: {
				value: texture,
			}
		},
		side: THREE.BackSide,
	})

	return mat;
}
