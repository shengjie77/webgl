import * as THREE from 'three';
import { Scene, PerspectiveCamera } from 'three';
import { pano1 } from 'src/resource';
import { JControl, JControlEvent } from 'src/utils/control';

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
	const control = new JControl(renderer.domElement);
	control.on(JControlEvent.Drag, (ev) => {
	})
	renderer.setSize(window.innerWidth, window.innerHeight);

	const pano = createPano(() => {
		render();
	});
	scene.add(pano);

	// camera.position.set(10, 10, 10);
	// camera.lookAt(0, 0, 0);

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