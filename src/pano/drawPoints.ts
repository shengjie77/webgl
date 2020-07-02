import { JProgram } from 'src/webgl';
import { pointFrag } from 'src/pano/shader/point.frag';
import { pointVert } from 'src/pano/shader/point.vert';
import { JPoint } from 'src/math';

export function drawPoints(gl: WebGLRenderingContext, pts: JPoint[], size: number) {
	const program = new JProgram(gl, {
		vertexShader: pointVert,
		fragmentShader: pointFrag,
	});

	gl.useProgram(program.program);
	const uniforms = program.getUniforms();
	uniforms.setValue('u_PointSize', size);

	const pointLocation = gl.getAttribLocation(program.program, 'a_Position');
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const array = new Float32Array(pts.flatMap(pt => [pt.getX(), pt.getY()]))
	gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(pointLocation);
	gl.vertexAttribPointer(pointLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.POINTS, 0, pts.length);

}
