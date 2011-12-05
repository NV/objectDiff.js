function Mock() {}
Mock.prototype = {
	size: 1,
	message: 'foo'
};

describe('toEqualProperties', function() {
	it('shows diff', function() {
		var a = new Mock;
		a.point = {
			x: 2,
			y: 3
		};

		var b = new Mock;
		b.message = 'bar';
		delete b.size;
		b.point = {
			x: 2,
			y: 7
		};

		expect(a).toEqualProperties(b);
	});
});

describe('toEqualOwnProperties', function() {
	it('shows diff', function() {
		var a = new Mock;
		a.point = {
			x: 2,
			y: 3
		};

		var b = new Mock;
		b.message = 'bar';
		b.point = {
			x: 2,
			y: 42
		};

		expect(a).toEqualOwnProperties(b);
	});
});
