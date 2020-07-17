import { deprecated } from 'src/utils/deprecated';

export type JRgba = [r: number, g: number, b: number, a: number];

export class JColor {

	public static fromRgba(rgba: JRgba): JColor {
		return new JColor(rgba);
	}

	constructor(rgba: JRgba) {
		[this._red, this._green, this._blue, this._alpha] = rgba;
	}

	@deprecated()
	public getRgba(): JRgba {
		return [
			this._red,
			this._green,
			this._blue,
			this._alpha,
		]
	}

	public get rgba() {
		return [
			this._red,
			this._green,
			this._blue,
			this._alpha,
		]
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private _red: number;

	private _green: number;

	private _blue: number;

	private _alpha: number;

}
