import { EventEmitter } from 'eventemitter3';

import { JControlEventMap } from 'src/utils/control';

export class JControl {

	constructor(el: HTMLElement) {
		this._el = el;
	}

	public on<T extends keyof JControlEventMap>(event: T, listener: (ev: JControlEventMap[T]) => void) {
		this.eventEmitter.on(event, listener);
	}

	public off<T extends keyof JControlEventMap>(event: T, listener: (ev: JControlEventMap[T]) => void) {
		this.eventEmitter.off(event, listener);
	}

	// ------------------------------------------------------- //
	// ---------------  Private Section Below  --------------- //
	// ------------------------------------------------------- //

	private _el: HTMLElement;

	private eventEmitter = new EventEmitter();

}
