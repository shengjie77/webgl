
/**
 * Marking deprecated method
 * 
 * ```TypeScript
 * class Foo {
 *   @deprecated()
 *   public fn1() {}
 *
 *   @deprecated('Use another api')
 *   public fn2() {}
 * }
 * ```
 *
 * @export
 * @param {string} [message]
 * @returns
 */
export function deprecated(message?: string) {
	return (target: any, key: string | symbol, desp: PropertyDescriptor) => {
		const method = desp.value;
		desp.value = (...args: any) => {
			console.warn(`Deprecated: ${key.toString()} is deprecated. ${message || ''}`);
			method.call(target, ...args);
		}
	}
}
