var objectDiff = typeof exports != 'undefined' ? exports : {};

/**
 * @param {Object} a
 * @param {Object} b
 * @nosideeffects
 * @return {Object}
 */
objectDiff.diff = function diff(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var result = {};

	for (var key in a) {
		if (key in b) {
			if (a[key] === b[key]) {
				result[key] = {
					changed: 'equals',
					value: a[key]
				}
			} else {
				var typeA = typeof a[key];
				var typeB = typeof b[key];
				if ((typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
					result[key] = {
						changed: 'object change',
						diff: diff(a[key], b[key])
					}
				} else {
					result[key] = {
						changed: 'primitive change',
						removed: a[key],
						added: b[key]
					}
				}
			}
		} else {
			result[key] = {
				changed: 'removed',
				value: a[key]
			}
		}
	}

	for (key in b) {
		if (!(key in a)) {
			result[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	return result;
};


/**
 * @param {Object} a
 * @param {Object} b
 * @nosideeffects
 * @return {Object}
 */
objectDiff.diffOwnProperties = function diffOwnProperties(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var result = {};
	var keys = Object.keys(a);

	for (var i = 0, length = keys.length; i < length; i++) {
		var key = keys[i];
		if (b.hasOwnProperty(key)) {
			if (a[key] === b[key]) {
				result[key] = {
					changed: 'equals',
					value: a[key]
				}
			} else {
				var typeA = typeof a[key];
				var typeB = typeof b[key];
				if ((typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
					result[key] = {
						changed: 'object change',
						diff: diffOwnProperties(a[key], b[key])
					}
				} else {
					result[key] = {
						changed: 'primitive change',
						removed: a[key],
						added: b[key]
					}
				}
			}
		} else {
			result[key] = {
				changed: 'removed',
				value: a[key]
			}
		}
	}

	keys = Object.keys(b);

	for (i = 0, length = keys.length; i < length; i++) {
		key = keys[i];
		if (!a.hasOwnProperty(key)) {
			result[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	return result;
};


(function() {

	/**
	 * @param {Object} diff
	 * @return {string}
	 */
	objectDiff.convertToXMLString = function convertToXMLString(diff) {
		var output = '';
		var properties = [];

		for (var key in diff) {
			var changed = diff[key].changed;
			switch (changed) {
				case 'equals':
					properties.push(stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value));
					break;

				case 'removed':
					properties.push('<del>' + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value) + '</del>');
					break;

				case 'added':
					properties.push('<ins>' + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(diff[key].value) + '</ins>');
					break;

				case 'primitive change':
					var prefix = stringifyObjectKey(escapeHTML(key)) + '<span>: </span>';
					properties.push(
						'<del class="key">' + prefix + escapeHTML(inspect(diff[key].removed)) + '</del><span>,</span>\n' +
						'<ins class="key">' + prefix + escapeHTML(inspect(diff[key].added)) + '</ins>');
					break;

				case 'object change':
					properties.push(stringifyObjectKey(key) + '<span>: </span>' + convertToXMLString(diff[key].diff));
					break;
			}
		}

		return '<span>{</span>\n<div class="level">' + properties.join('<span>,</span>\n') + '\n</div><span>}</span>';
	};


	var _repeatCache = {};
	/**
	 * repeatString("\t", 2) ==> "\t\t"
	 * @param {String} string
	 * @param {Number} times
	 */
	function repeatString(string, times) {
		if (times == 1) {
			return string;
		} else if (times < 1) {
			return '';
		}

		var key = string + times;

		if (_repeatCache[key]) {
			return _repeatCache[key];
		} else {
			var result = string;
			for (var i = times; --i;) {
				result += string;
			}
			_repeatCache[key] = result;
		}

		return result;
	}

	/**
	 * @param {string} key
	 * @return {string}
	 */
	function stringifyObjectKey(key) {
		return /^[a-z_$][a-z0-9_$]*$/i.test(key) ?
			key :
			JSON.stringify(key);
	}

	/**
	 * @param {string} string
	 * @return {string}
	 */
	function escapeHTML(string) {
		return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/**
	 * @param {Object} obj
	 * @return {string}
	 */
	function inspect(obj) {
		switch(typeof obj) {
			case 'object':
				var properties = [];
				for (var key in obj) {
					properties.push(stringifyObjectKey(escapeHTML(key)) + '<span>: </span>' + inspect(obj[key]));
				}
				return '<span>{</span>\n<div class="level">' + properties.join('<span>,</span>\n') + '\n</div><span>}</span>';

			case 'string':
				return JSON.stringify(escapeHTML(obj));

			default:
				return escapeHTML(obj.toString());
		}
	}
})();
