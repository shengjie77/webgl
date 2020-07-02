import { drawPoints } from 'src/pano/drawPoints';

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

	drawPoints(gl, [
			{ x: 1, y: 1 },
			{ x: -1, y: 0 },
			{ x: -1, y: -1 },
    ], 20);
}

function createCanvas(parent?: HTMLElement): HTMLCanvasElement {
	const canvas = document.createElement('canvas');

	canvas.style.width = '100vw';
	canvas.style.height = '100vh';

	const parentNode = parent ?? document.body;
	parentNode.appendChild(canvas);

	return canvas;
}
