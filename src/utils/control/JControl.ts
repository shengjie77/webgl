import { EventEmitter } from 'eventemitter3';

import { JControlEventMap } from 'src/utils/control';

export class JControl {

	constructor(el: HTMLElement) {
		this._el = el;

		this.bindEvent();
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

	private bindEvent() {
		let isMouseDown = false;
		let isDragging = false;
		this._el.onmousedown = (ev) => {
			isMouseDown = true;
		}

		this._el.onmousemove = (ev) => {
			if (!isMouseDown) {
				return;
			}

			if (isDragging) {
				this.notifyDrag();
			} else {
				isDragging = true;
				this.notifyBeforeDrag();
			}
		}

		this._el.onmouseup = (ev) => {
			isMouseDown = false;
			if (isDragging) {
				this.notifyAfterDrag();
				isDragging = false;
			}
		}
	}

	private notifyBeforeDrag() {
		console.log('Before Drag');
	}

	private notifyDrag() {
		console.log('Drag');
	}

	private notifyAfterDrag() {
		console.log('After Drag');
	}

	private _el: HTMLElement;

	private eventEmitter = new EventEmitter();

}
