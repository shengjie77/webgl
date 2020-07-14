
export enum JControlEvent {

	BeforeDrag = 'BeforeDrag',

	Drag = 'Drag',

	AfterDrag = 'Drag',

}

export interface JControlEventMap {
	[JControlEvent.BeforeDrag]: JDragEvent;
	[JControlEvent.Drag]: JDragEvent;
	[JControlEvent.AfterDrag]: JDragEvent;
}

export interface JDragEvent {
	x: number;
	y: number;
}
