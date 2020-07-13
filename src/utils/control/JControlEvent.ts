
export enum JControlEvent {

	BeforeDrag = 'BeforeDrag',

	Drag = 'Drag',

	AfterDrag = 'Drag',

}

export interface JControlEventMap {
	[JControlEvent.BeforeDrag]: JDragEvent;
}

export interface JDragEvent {
	x: number;
	y: number;
}
