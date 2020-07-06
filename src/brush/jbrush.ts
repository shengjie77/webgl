import { JColor } from 'src/color';

export class JBrush {

	public static from(param: Partial<JBrushParameter>): JBrush {
		return new JBrush(param);
	}

	constructor(param?: Partial<JBrushParameter>) {
		const { color } = this.mergeWithDefault(param);

		this.color = color;
	}

	public setColor(color: JColor): void {
		this.color = color;
	}

	public getColor(): JColor {
		return this.color;
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private mergeWithDefault(param?: Partial<JBrushParameter>) {
		const paramWithDefault = {
			...this.getDefaultParameter(),
			...param,
		}

		return paramWithDefault;
	}

	private getDefaultParameter(): JBrushParameter {
		return {
			color: JColor.fromRgba([1, 1, 1, 1]),
		}
	}

	private color: JColor;

}

export interface JBrushParameter {
	color: JColor;
}
