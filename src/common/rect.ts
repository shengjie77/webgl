import { Point } from 'src/common/point';

export class Rect {

	constructor(x: number, y: number, width: number, height: number) {
		this.left = x;
		this.right = x + width;
		this.top = y;
		this.bottom = y + height;
		this.width = width;
		this.height = height;
	}

	public getTopLeft(): Point {
		return {
			x: this.left,
			y: this.top,
		}
	}

	public getTopRight(): Point {
		return {
			x: this.right,
			y: this.top,
		}
	}

	public getBottomLeft(): Point {
		return {
			x: this.left,
			y: this.bottom,
		}
	}

	public getBottomRight(): Point {
		return {
			x: this.right,
			y: this.bottom,
		}
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

	private top: number;
	private bottom: number;
	private left: number;
	private right: number;

	private width: number;
	private height: number;

}
