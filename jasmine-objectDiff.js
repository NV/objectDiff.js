objectDiff.jasmine = {

	toEqualProperties: function(expected) {
		var diff = objectDiff.diff(expected, this.actual);
		this.message = function() {
			var pre = document.createElement('pre');
			pre.className = 'diff-holder';
			pre.innerHTML = objectDiff.convertToXMLString(diff);
			return pre;
		};
		return diff.changed === 'equal';
	},

	toEqualOwnProperties: function(expected) {
		var diff = objectDiff.diffOwnProperties(expected, this.actual);
		this.message = function() {
			var pre = document.createElement('pre');
			pre.className = 'diff-holder';
			pre.innerHTML = objectDiff.convertToXMLString(diff);
			return pre;
		};
		return diff.changed === 'equal';
	}

};
