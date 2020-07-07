import * as THREE from 'three';
import { debounce, wrap } from 'lodash';


import { drawPoints } from 'src/pano/drawPoints';
import { JRect, JPoint } from 'src/math';
import { JPainter } from 'src/painter';
import { JProgram } from 'src/webgl';

const setting = {
	x: 0,
	y: 0,
	z: 0,
	angleX: 0,
	angleY: 0,
	angleZ: 0,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1,
}

main();

function main() {
	const canvas = createCanvas();
	const gl = canvas.getContext('webgl');
	if (!gl) {
		return;
	}

	createSetting(() => {
		render(gl);
	})

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

	gl.clearColor(1, 1, 1, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	testDrawPoints(gl);

	testDrawRect(gl);

	drawF(gl);
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
		width: 200,
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

function drawF(gl: WebGLRenderingContext) {
	const vert = `
		attribute vec4 a_position;

		uniform mat4 u_projection;

		void main() {
			gl_Position = u_projection * a_position;
		}
	`;

	const frag = `
		void main() {
			gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
		}
	`;

	const program = new JProgram(gl, {
		vertexShader: vert,
		fragmentShader: frag,
	});

	gl.useProgram(program.program);

	const uniforms = program.getUniforms();
	const projection = getTransform(gl);
	uniforms.setValue('u_projection', projection);

	// create vertex buffer
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const data = new Float32Array([
		// left column
		0, 0, 0,
		30, 0, 0,
		0, 150, 0,
		0, 150, 0,
		30, 0, 0,
		30, 150, 0,

		// top rung
		30, 0, 0,
		100, 0, 0,
		30, 30, 0,
		30, 30, 0,
		100, 0, 0,
		100, 30, 0,

		// middle rung
		30, 60, 0,
		67, 60, 0,
		30, 90, 0,
		30, 90, 0,
		67, 60, 0,
		67, 90, 0,
	]);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	// asign to attribute
	const location = gl.getAttribLocation(program.program, 'a_position');
	gl.enableVertexAttribArray(location);
	gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 18);
}

function getTransform(gl: WebGLRenderingContext): number[] {
	const project = new THREE.Matrix4().makeOrthographic(
		0, gl.canvas.width,
		0, gl.canvas.height,
		-200, 1000,
	);
	const translate = new THREE.Matrix4().makeTranslation(setting.x, setting.y, setting.z);

	const rad = (deg: number) => deg * Math.PI / 180;
	const rotateX = new THREE.Matrix4().makeRotationX(rad(setting.angleX));
	const rotateY = new THREE.Matrix4().makeRotationY(rad(setting.angleY));
	const rotateZ = new THREE.Matrix4().makeRotationZ(rad(setting.angleZ));

	return project
		.multiply(translate)
		.multiply(rotateX)
		.multiply(rotateY)
		.multiply(rotateZ)
		.toArray()
}

function createSetting(onChange: () => void) {
	const wrapper = document.createElement('div');

	// style
	wrapper.style.position = 'fixed';
	wrapper.style.right = '0';
	wrapper.style.top = '0';

	const x = createSlider('x', setting.x, 0, 400, (v: number) => {
		setting.x = v;
		onChange();
	})
	wrapper.appendChild(x);

	const y = createSlider('y', setting.y, 0, 400, (v: number) => {
		setting.y = v;
		onChange();
	})
	wrapper.append(y);

	const z = createSlider('z', setting.z, 0, 400, (v: number) => {
		setting.z = v;
		onChange();
	})
	wrapper.append(z);

	const angleX = createSlider('angleX', setting.angleX, 0, 360, (v: number) => {
		setting.angleX = v;
		onChange();
	})
	wrapper.append(angleX);

	const angleY = createSlider('angleY', setting.angleY, 0, 360, (v: number) => {
		setting.angleY = v;
		onChange();
	})
	wrapper.append(angleY);

	const angleZ = createSlider('angleZ', setting.angleZ, 0, 360, (v: number) => {
		setting.angleZ = v;
		onChange();
	})
	wrapper.append(angleZ);

	document.body.appendChild(wrapper);
}

function createSlider(name: string, value: number, minValue: number, maxValue: number, onChange: (value: number) => void): HTMLElement {
	const wrapper = document.createElement('div');

	const label = document.createTextNode(name);
	wrapper.appendChild(label)

	const input = document.createElement('input');
	input.min = `${minValue}`;
	input.max = `${maxValue}`;
	input.value = `${value}`;
	input.type = 'range';
	wrapper.appendChild(input);

	const valueEl = document.createElement('span');
	valueEl.style.width = '40px';
	valueEl.style.display = 'inline-block';
	valueEl.textContent = `${value}`;
	wrapper.appendChild(valueEl);

	input.oninput = debounce((ev) => {
		const el = ev.target as HTMLInputElement;
		const v = parseFloat(el.value);
		onChange(v);
		valueEl.textContent = el.value;
	}, 0);

	return wrapper;
}
