import { JPoint } from 'src/math/point';

export class JRect {

	public static from(param: SizeParameter | VertexParameter): JRect {
		const rect = isSizeParameter(param)
			? fromSizeParameter(param)
			: fromVertexParameter(param)

		return rect;
	}

	constructor(top: number, right: number, bottom: number, left: number) {
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.left = left;
	}

	public getTopLeft(): JPoint {
		return JPoint.from(
			this.left,
			this.top,
		)
	}

	public getTopRight(): JPoint {
		return JPoint.from(
			this.right,
			this.top,
		)
	}

	public getBottomLeft(): JPoint {
		return JPoint.from(
			this.left,
			this.bottom,
		)
	}

	public getBottomRight(): JPoint {
		return JPoint.from(
			this.right,
			this.bottom,
		)
	}

	public getTop(): number {
		return this.top;
	}

	public getBottom(): number {
		return this.bottom;
	}

	public getLeft(): number {
		return this.left;
	}

	public getRight(): number {
		return this.right;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private top: number;

	private bottom: number;

	private left: number;

	private right: number;
	
}

interface SizeParameter {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface VertexParameter {
	topLeft: JPoint;
	bottomRight: JPoint;
}

function isSizeParameter(param: SizeParameter | VertexParameter): param is SizeParameter {
	return (param as SizeParameter).x !== undefined;
}

function fromSizeParameter(param: SizeParameter): JRect {
	const { x, y, width, height } = param;
	return new JRect(
		y,
		x + width,
		y + height,
		x,
	)
}

function fromVertexParameter(param: VertexParameter): JRect {
	const { topLeft, bottomRight } = param;
	return new JRect(
		topLeft.getY(),
		bottomRight.getX(),
		bottomRight.getY(),
		topLeft.getX(),
	)
}