
export type JRgba = [r: number, g: number, b: number, a: number];

export class JColor {

	public static fromRgba(rgba: JRgba): JColor {
		return new JColor(rgba);
	}

	constructor(rgba: JRgba) {
		[this.r, this.g, this.b, this.a] = rgba;
	}

	public getRgba(): JRgba {
		return [
			this.r,
			this.g,
			this.b,
			this.a,
		]
	}

	private r: number;
	private g: number;
	private b: number;
	private a: number;

}
