import { assertNotNullable } from "src/utils/assert";
import { Uniforms } from 'src/common/uniforms';

interface ProgramParameter {
	vertexShader: string;
	fragmentShader: string;
}

export class Program {

	public program: WebGLProgram;

	constructor(gl: WebGLRenderingContext, param: ProgramParameter) {
		const program = gl.createProgram();

		assertNotNullable(program, 'Failed to create program.');

		const vertexShader = createShader(gl, gl.VERTEX_SHADER, param.vertexShader);
		gl.attachShader(program, vertexShader);

		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, param.fragmentShader);
		gl.attachShader(program, fragmentShader);

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const log = gl.getProgramInfoLog(program);
			throw new Error(`Can not compile WebGL program. ${log}`);
		}

		this.program = program;
		this.gl = gl;
	}

	public getUniforms() {
		return new Uniforms(this.gl, this.program);
	}

	private gl: WebGLRenderingContext;

}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);

	assertNotNullable(shader, 'Cannot create shader');

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.warn(gl.getShaderInfoLog(shader));
	}

	return shader;
}
