import { JPoint, JRect, JLine } from 'src/math';
import { JPen } from 'src/pen';
import { JBrush } from 'src/brush';

export interface IPainter {

	drawPoint(pt: JPoint): void;

	drawLine(line: JLine): void;

	drawRect(rect: JRect): void;

	drawImage(rect: JRect, img: HTMLImageElement): void;

	setPen(pen: JPen): void;

	getPen(): JPen;

	setBrush(brush: JBrush): void;

	getBrush(): JBrush;

}
