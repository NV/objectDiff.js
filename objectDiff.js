/**
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
function objectDiff(a, b) {

	if (a === b) {
		return {
			changed: 'equal',
			value: a
		}
	}

	var diff = {};

	for (var key in a) {
		if (key in b) {
			if (a[key] === b[key]) {
				diff[key] = {
					changed: 'equals',
					value: a[key]
				}
			} else {
				var typeA = typeof a[key];
				var typeB = typeof b[key];
				if ((typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
					diff[key] = {
						changed: 'object change',
						diff: objectDiff(a[key], b[key])
					}
				} else {
					diff[key] = {
						changed: 'primitive change',
						removed: a[key],
						added: b[key]
					}
				}
			}
		} else {
			diff[key] = {
				changed: 'removed',
				value: a[key]
			}
		}
	}

	for (key in b) {
		if (!(key in a)) {
			diff[key] = {
				changed: 'added',
				value: b[key]
			}
		}
	}

	return diff;
}

/**
 * repeatString("Ha ", 2) ==> "Ha Ha "
 * @param {String} string
 * @param {Number} times
 */
function repeatString(string, times) {
	if (times == 1) {
		return string;
	} else if (times < 1) {
		return '';
	}

	if (string in repeatString.cache && times in repeatString.cache[string]) {
		return repeatString.cache[string][times];
	} else {
		var result = string;
		for (var i = times; --i;) {
			result += string;
		}
		repeatString.cache[string] || (repeatString.cache[string] = {});
		repeatString.cache[string][times] = result; 
	}

	return result;
}
repeatString.cache = {};


/**
 * @param {string} key
 * @return {string}
 */
function stringifyObjectKey(key) {
	return /^[a-z_$][a-z0-9_$]*$/i.test(key) ?
		key :
		JSON.stringify(key);
}


var INDENT = '  ';


/**
 * @param {Object} diff
 * @param {number} depth
 * @return {string}
 */
function outputDiff(diff, depth) {
	depth ? depth++ : (depth = 1);
	var output = '<span>{</span>\n';
	var properties = [];

	var indent = repeatString(INDENT, depth - 1);
	var innerIndent = repeatString(INDENT, depth);

	for (var key in diff) {
		var changed = diff[key].changed;
		switch (changed) {
			case 'equals':
				properties.push(innerIndent + stringifyObjectKey(key) + '<span>: </span>' + inspect(diff[key].value, depth));
				break;

			case 'removed':
				properties.push('<del>' + innerIndent + stringifyObjectKey(key) + '<span>: </span>' + inspect(diff[key].value, depth) + '</del>');
				break;

			case 'added':
				properties.push('<ins>' + innerIndent + stringifyObjectKey(key) + '<span>: </span>' + inspect(diff[key].value, depth) + '</ins>');
				break;

			case 'primitive change':
				var prefix = innerIndent + stringifyObjectKey(key) + '<span>: </span>';
				properties.push(
					'<del class="key">' + prefix + inspect(diff[key].removed, depth) + '</del><span>,</span>\n' +
					'<ins class="key">' + prefix + inspect(diff[key].added, depth) + '</ins>');
				break;

			case 'object change':
				properties.push(innerIndent + stringifyObjectKey(key) + '<span>: </span>' + outputDiff(diff[key].diff, depth));
				break;

		}
	}

	return output + properties.join('<span>,</span>\n') + '\n' + indent + '<span>}</span>';
}


/**
 * @param {Object} obj
 * @param {number} depth
 * @param {Array} stack
 * @return {string}
 */
function inspect(obj, depth, stack) {
	depth ? depth++ : (depth = 1);
	var _stack = stack ? stack.slice(0) : [obj];

	switch(typeof obj) {
		case 'object':
			var properties = [];
			var indent = repeatString(INDENT, depth);
			for (var key in obj) {
				properties.push(indent + stringifyObjectKey(key) + '<span>: </span>' + inspect(obj[key], depth, stack));
			}
			var indentInside = repeatString(INDENT, depth - 1);
			return '<span>{</span>\n' + properties.join('<span>,</span>\n') + '\n' + indentInside + '<span>}</span>';

		case 'string':
			return '"' + obj + '"';

		default:
			return obj.toString();
	}
}
