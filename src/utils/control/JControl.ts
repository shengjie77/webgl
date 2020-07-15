import { EventEmitter } from 'eventemitter3';

import { JControlEventMap } from 'src/utils/control';
import { JControlEvent } from './JControlEvent';

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
				this.notifyDrag(ev);
			} else {
				isDragging = true;
				this.notifyBeforeDrag(ev);
			}
		}

		this._el.onmouseup = (ev) => {
			isMouseDown = false;
			if (isDragging) {
				this.notifyAfterDrag(ev);
				isDragging = false;
			}
		}
	}

	private notifyBeforeDrag(ev: MouseEvent) {
		this.eventEmitter.emit(JControlEvent.BeforeDrag, {
			x: ev.clientX,
			y: ev.clientY,
		})
	}

	private notifyDrag(ev: MouseEvent) {
		this.eventEmitter.emit(JControlEvent.Drag, {
			x: ev.clientX,
			y: ev.clientY,
		})
	}

	private notifyAfterDrag(ev: MouseEvent) {
		this.eventEmitter.emit(JControlEvent.AfterDrag, {
			x: ev.clientX,
			y: ev.clientY,
		})
	}

	private _el: HTMLElement;

	private eventEmitter = new EventEmitter();

}
