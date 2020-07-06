import * as THREE from 'three';

import { drawPoints } from 'src/pano/drawPoints';
import { JRect, JPoint } from 'src/math';
import { JPainter } from 'src/painter';

main();

function main() {
	const canvas = createCanvas();
	const gl = canvas.getContext('webgl');
	if (!gl) {
		return;
	}

	render(gl);

	window.onresize = () => {
		render(gl);
	}
}

function render(gl: WebGLRenderingContext) {
	gl.canvas.width = window.innerWidth;
	gl.canvas.height = window.innerHeight;

	const { width, height } = gl.canvas;
	gl.viewport(0, 0, width, height);

	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	testDrawPoints(gl);

	testDrawRect(gl);
}

function testDrawPoints(gl: WebGLRenderingContext) {
	drawPoints(
		gl,
		[
			JPoint.from(0, 0),
			JPoint.from(1, 1),
			// JPoint.from(0, -1),
			// JPoint.from(0.5, 0),
		],
		20,
	);
}

function testDrawRect(gl: WebGLRenderingContext) {
	const painter = new JPainter(gl.canvas);
	const rect = JRect.from({
		x: 20,
		y: 20,
		width: 100,
		height: 200,
	})
	painter.drawRect(rect);
}

function createCanvas(parent?: HTMLElement): HTMLCanvasElement {
	const canvas = document.createElement('canvas');

	canvas.style.width = '100vw';
	canvas.style.height = '100vh';

	const parentNode = parent ?? document.body;
	parentNode.appendChild(canvas);

	return canvas;
}
