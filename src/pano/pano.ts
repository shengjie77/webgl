import { drawPoints } from 'src/pano/drawPoints';
import { drawRect } from 'src/pano/drawRect';
import { JRect, JPoint } from 'src/math';
import { JColor } from 'src/color';


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
			JPoint.from(1, 1),
			JPoint.from(-1, 0),
			JPoint.from(-1, -1),
		],
		20,
	);
}

function testDrawRect(gl: WebGLRenderingContext) {
	drawRect(
		gl,
		JRect.from({
			x: 0,
			y: 0,
			width: 0.2,
			height: 0.2,
		}),
		JColor.fromRgba([1, 0, 1, 0.5]),
	)
}

function createCanvas(parent?: HTMLElement): HTMLCanvasElement {
	const canvas = document.createElement('canvas');

	canvas.style.width = '100vw';
	canvas.style.height = '100vh';

	const parentNode = parent ?? document.body;
	parentNode.appendChild(canvas);

	return canvas;
}
