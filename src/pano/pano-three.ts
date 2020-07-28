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
		1000,
	)

	camera.applyQuaternion(new THREE.Quaternion(-0.108813, -0.843762, -0.186910, 0.4912108));

	const renderer = new THREE.WebGLRenderer();
	document.body.append(renderer.domElement);

	const pano = createPano(() => {
		render();
	});

	bindCamera(camera, document as any);

	scene.add(pano);
	const model = createModel();
	scene.add(model);

	function render() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);

		requestAnimationFrame(() => {
			render();
		})
	}

	render();
}

function createModel() {
	const size = 5;
	const geo = new THREE.BoxGeometry(size, size, size);
	const mat = new THREE.MeshBasicMaterial({
		color: 'red',
		depthTest: false,
	})
	const mesh = new THREE.Mesh(geo, mat);
	const distance = 50;
	mesh.position.set(distance, 0, distance);

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
