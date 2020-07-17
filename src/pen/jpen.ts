import { JColor } from 'src/color';

export class JPen {

	public static from(param: PartialParameter): JPen {
		return new JPen(param);
	}

	constructor(param?: PartialParameter) {
		if (!param) {
			return;
		}

		if (param.color) {
			this._color = param.color;
		}

		if (param.width) {
			this._width = param.width;
		}
	}

	public set color(v: JColor) {
		this._color = v;
	}

	public get color(): JColor {
		return this._color;
	}

	public set width(v: number) {
		this._width = v;
	}

	public get width(): number {
		return this._width;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private _color: JColor = JColor.fromRgba([1, 1, 1, 1]);

	private _width: number = 1;

}

export interface JPenParameter {
	color: JColor;
	width: number;
}

type PartialParameter = Partial<JPenParameter>;
