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

	const renderer = new THREE.WebGLRenderer();
	document.body.append(renderer.domElement);
	renderer.setSize(window.innerWidth, window.innerHeight);

	const pano = createPano(() => {
		render();
	});

	bindCamera(camera, renderer.domElement);

	scene.add(pano);

	function render() {
		renderer.render(scene, camera);

		requestAnimationFrame(() => {
			render();
		})
	}

	render();
}

function createPano(onLoad: () => void) {
	const size = 5;
	const geo = new THREE.BoxGeometry(
		size,
		size,
		size,
	);

	const mats = pano1.map(url => {
		const loader = new THREE.TextureLoader();
		const texture = loader.load(url);
		return new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.BackSide,
		})
	})
	const mesh = new THREE.Mesh(geo, mats);

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
