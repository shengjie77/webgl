
/**
 * 检测某些变量不为undefined的guard
 *
 * @export
 * @template T
 * @param {T} [obj]
 * @param {string} [errMessage]
 * @returns
 * @category viewer
 */
export function mustDefined<T>(obj?: T, errMessage?: string) {
	if (obj === undefined) {
		throw new Error(errMessage);
	}

	return obj;
}

export function unused(v: any) {
	return v;
}

// Deprecated, use assertNotNullable instead
export function assertIsDefined<T>(val?: T, message?: string): asserts val is T {
	if (val === undefined || val === null) {
		throw new Error(message);
	}
}

export function assertNotNullable<T>(val: T | undefined | null, message?: string): asserts val is T {
	if (val === undefined || val === null) {
		throw new Error(message);
	}
}

export function assert(val: boolean, message?: string): asserts val {
	if (!val) {
		throw new Error(message);
	}
}
