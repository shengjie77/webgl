import { JColor } from 'src/color';

export class JPen {

	public static from(param: PartialParameter): JPen {
		return new JPen(param);
	}

	constructor(param: PartialParameter) {
		if (param.color) {
			this.color = param.color;
		}

		if (param.width) {
			this.width = param.width;
		}
	}

	public setColor(color: JColor): void {
		this.color = color;
	}

	public getColor(): JColor {
		return this.color;
	}

	public setWidth(width: number): void {
		this.width = width;
	}

	public getWidth(): number {
		return this.width;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private color: JColor = JColor.fromRgba([1, 1, 1, 1]);

	private width: number = 1;

}

export interface JPenParameter {
	color: JColor;
	width: number;
}

type PartialParameter = Partial<JPenParameter>;
