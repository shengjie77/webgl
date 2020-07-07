import { assertNotNullable } from "src/utils/assert";

export class Uniforms {

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.gl = gl;
		this.program = program;

		this.initParameters(gl, program);
    }
    
	public setValue(name: string, value: any) {
		const p = this.parameters.find(p => p.name === name);
		if (!p) {
			console.warn(`Cannot find uniform(${name})`);
			return;
		}

		const setUniform = this.getValueSetter(p.type);
		const location = this.gl.getUniformLocation(this.program, name);

		assertNotNullable(location);

		setUniform(this.gl, location, value);
	}

	private getValueSetter(type: GLenum) {
		const table = {
			[this.gl.FLOAT]: uniform1f,
			[this.gl.FLOAT_VEC4]: uniform4fv,
			[this.gl.FLOAT_MAT3]: uniformMatrix3fv,
			[this.gl.FLOAT_MAT4]: uniformMatrix4fv,
		}

		return table[type];
	}

	private initParameters(gl: WebGLRenderingContext, program: WebGLProgram) {
		const paramCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < paramCount; i++) {
			const param = gl.getActiveUniform(program, i);
			assertNotNullable(param);

			this.parameters.push(param);
		}
	}

	private gl: WebGLRenderingContext;
	private program: WebGLProgram;
	private parameters: WebGLActiveInfo[] = [];
	
}

function uniform1f(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: GLfloat) {
	gl.uniform1f(location, value);
}

function uniform4fv(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: Float32List) {
	gl.uniform4fv(location, value);
}

function uniformMatrix3fv(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: Float32List) {
	gl.uniformMatrix3fv(location, false, value);
}

function uniformMatrix4fv(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: Float32List) {
	gl.uniformMatrix4fv(location, false, value);
}
