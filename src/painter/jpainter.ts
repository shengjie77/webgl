import { IPainter } from 'src/painter';
import { JPoint, JLine, JRect, JMatrix3 } from 'src/math';
import { JPen } from 'src/pen';
import { JBrush } from 'src/brush';
import { assertNotNullable } from 'src/utils/assert';
import { JProgram } from 'src/webgl';
import {
	rectVert,
	rectFrag
} from 'src/pano/shader';
import { JColor } from 'src/color';

export class JPainter implements IPainter {

	constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
		this.pen = new JPen();
		this.brush = new JBrush();

		const ctx = canvas.getContext('webgl');
		assertNotNullable(ctx);
		this.ctx = ctx;

		this.updateProjectMatrix();
	}

	public drawPoint(pt: JPoint) {
		// UNIMPLEMENTED: 
		return {} as any;
	}

	public drawLine(line: JLine) {
		// UNIMPLEMENTED: 
		return {} as any;
	}

	public drawRect(rect: JRect) {
		const gl = this.ctx;

		const program = new JProgram(gl, {
			vertexShader: rectVert,
			fragmentShader: rectFrag,
		})

		gl.useProgram(program.program);

		const uniforms = program.getUniforms();
		const color = new JColor([1, 0, 0.5, 1]);
		uniforms.setValue('u_Color', color.getRgba());
		uniforms.setValue('u_projection', this.projectMatrix.toArray());

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

	public drawImage(rect: JRect, img: HTMLImageElement) {
		// UNIMPLEMENTED: 
		return {} as any;
	}

	public setPen(pen: JPen) {
		this.pen = pen;
	};

	public getPen(): JPen {
		return this.pen;
	}

	public setBrush(brush: JBrush) {
		this.brush = brush;
	}

	public getBrush(): JBrush {
		return this.brush;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private updateProjectMatrix() {
		const width = this.ctx.canvas.width;
		const height = this.ctx.canvas.height;

		this.projectMatrix = new JMatrix3()
			.set(
				1, 0, 0,
				0, -1, 0,
				0, 0, 1,
			)
			.scale(1 / width, 1 / height)
			.translate(-1, 1)
	}

	private ctx: WebGLRenderingContext;

	private pen: JPen;

	private brush: JBrush;

	private projectMatrix = new JMatrix3();

}
