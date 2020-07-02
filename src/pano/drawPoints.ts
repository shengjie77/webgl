import { Point } from 'src/common/point';
import { Program } from 'src/common/program';
import { pointFrag } from 'src/pano/shader/point.frag';
import { pointVert } from 'src/pano/shader/point.vert';

export function drawPoints(gl: WebGLRenderingContext, pts: Point[], size: number) {
	const program = new Program(gl, {
		vertexShader: pointVert,
		fragmentShader: pointFrag,
	}).program;

	gl.useProgram(program);

	const pointSizeLocation = gl.getUniformLocation(program, 'u_PointSize');
	gl.uniform1f(pointSizeLocation, size);

	const pointLocation = gl.getAttribLocation(program, 'a_Position');
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const array = new Float32Array(pts.flatMap(pt => [pt.x, pt.y]))
	gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(pointLocation);
	gl.vertexAttribPointer(pointLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.POINTS, 0, pts.length);
}
