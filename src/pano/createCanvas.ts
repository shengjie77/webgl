
export function createCanvas(parent?: HTMLElement): HTMLCanvasElement {
	const canvas = document.createElement('canvas');

	canvas.style.width = '100vw';
	canvas.style.height = '100vh';

	const parentNode = parent ?? document.body;
	parentNode.appendChild(canvas);

	return canvas;
}
