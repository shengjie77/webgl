
export function range(min: number, max: number): PropertyDecorator {
	return function (object, key) {
		let value: any;
		Object.defineProperty(object, key, {
			set: function (v) {
				if (v < min || v > max) {
					throw new Error('Error');
				}
				value = v;
			},
			get: function () {
				return value;
			},
		})
	}
}

class Foo {

	@range(0, 10)
    public value: number = 0;

}

