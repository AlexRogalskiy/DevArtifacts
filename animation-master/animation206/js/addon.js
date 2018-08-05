var $ = document;

var $$ = function $$(sel) {
	var arr = void 0;

	if (sel.charAt('0') === '#' && sel.indexOf(' ') < 0) {
		return $.getElementById(sel.replace('#', ''));
	}

	arr = [].slice.call($.querySelectorAll(sel));
	if (arr.length < 2) arr = arr[0];
	return arr;
};

Object.getOwnPropertyNames(Math).map(function (p) {
	window[p] = Math[p];
});

var rand = function rand() {var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var _int = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	var gen = min + (max - min) * random();
	return _int ? round(gen) : gen;
};

var randsgn = function randsgn() {
	return random() > .5 ? 1 : -1;
};

Node.prototype._attr = function (a) {
	if (typeof a === 'string')
	return this.getAttribute(a);else
	{
		for (var p in a) {
			this.setAttribute(p, a[p]);
		}
	}
};

Node.prototype._add = function (content, before, tag, classes, dataset, ns) {
	var node = void 0,n = void 0;

	node = tag ?
	ns ? $.createElementNS(ns, tag) : $.createElement(tag) :
	$.createTextNode(content);

	if (tag) {
		if (classes) {
			n = classes.length;

			while (n--) {
				node.classList.add(classes[n]);
			}
		}
		if (content || content === 0)
		node.textContent = content;
		if (dataset) node._attr(dataset);
	}

	if (typeof before === 'number') this.insertBefore(node, before);else
	this.appendChild(node);

	return node;
};