
export class JPoint {

	public static from(x: number, y: number) {
		return new JPoint(x, y);
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public getX(): number {
		return this.x;
	}

	public getY(): number {
		return this.y;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private x: number;

	private y: number;

}
