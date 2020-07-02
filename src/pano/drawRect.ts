import { JProgram } from 'src/webgl';
import { rectVert } from 'src/pano/shader/rect.vert';
import { rectFrag } from 'src/pano/shader/rect.frag';
import { JRect } from 'src/math';
import { JColor } from 'src/color';

export function drawRect(gl: WebGLRenderingContext, rect: JRect, color: JColor) {
	const program = new JProgram(gl, {
		vertexShader: rectVert,
		fragmentShader: rectFrag,
	})

	gl.useProgram(program.program);

	const uniforms = program.getUniforms();
	uniforms.setValue('u_Color', color.getRgba());

	const positionLocation = gl.getAttribLocation(program.program, 'a_Position');
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const arr = new Float32Array([
		// top left
		rect.getLeft(), rect.getTop(),
		// top right
		rect.getRight(), rect.getTop(),
		// bottom right
		rect.getRight(), rect.getBottom(),

		rect.getLeft(), rect.getBottom(),
	])
	gl.bufferData(
		gl.ARRAY_BUFFER,
		arr,
		gl.STATIC_DRAW,
	)
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

}

