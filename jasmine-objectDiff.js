objectDiff.jasmine = {

	toEqualProperties: function(expected) {
		var diff = objectDiff.diff(this.actual, expected);
		this.message = function() {
			var pre = document.createElement('pre');
			pre.className = 'diff-holder';
			pre.innerHTML = objectDiff.convertToXMLString(diff);
			return pre;
		};
		return diff.changed === 'equal';
	},

	toEqualOwnProperties: function(expected) {
		var diff = objectDiff.diffOwnProperties(this.actual, expected);
		this.message = function() {
			var pre = document.createElement('pre');
			pre.className = 'diff-holder';
			pre.innerHTML = objectDiff.convertToXMLString(diff);
			return pre;
		};
		return diff.changed === 'equal';
	}

};
