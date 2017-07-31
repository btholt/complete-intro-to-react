(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.preactRenderToString = factory());
}(this, (function () {

var NON_DIMENSION_PROPS = {
	boxFlex: 1, boxFlexGroup: 1, columnCount: 1, fillOpacity: 1, flex: 1, flexGrow: 1,
	flexPositive: 1, flexShrink: 1, flexNegative: 1, fontWeight: 1, lineClamp: 1, lineHeight: 1,
	opacity: 1, order: 1, orphans: 1, strokeOpacity: 1, widows: 1, zIndex: 1, zoom: 1
};

var ESC = {
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'&': '&amp;'
};

var objectKeys = Object.keys || function (obj) {
	var keys = [];
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) keys.push(i);
	}return keys;
};

var encodeEntities = function (s) {
	return String(s).replace(/[<>"&]/g, escapeChar);
};

var escapeChar = function (a) {
	return ESC[a] || a;
};

var falsey = function (v) {
	return v == null || v === false;
};

var memoize = function (fn) {
	var mem = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	return function (v) {
		return mem[v] || (mem[v] = fn(v));
	};
};

var indent = function (s, char) {
	return String(s).replace(/(\n+)/g, '$1' + (char || '\t'));
};

var isLargeString = function (s, length, ignoreLines) {
	return String(s).length > (length || 40) || !ignoreLines && String(s).indexOf('\n') !== -1 || String(s).indexOf('<') !== -1;
};

function styleObjToCss(s) {
	var str = '';
	for (var prop in s) {
		var val = s[prop];
		if (val != null) {
			if (str) str += ' ';
			str += jsToCss(prop);
			str += ': ';
			str += val;
			if (typeof val === 'number' && !NON_DIMENSION_PROPS[prop]) {
				str += 'px';
			}
			str += ';';
		}
	}
	return str || undefined;
}

function hashToClassName(c) {
	var str = '';
	for (var prop in c) {
		if (c[prop]) {
			if (str) str += ' ';
			str += prop;
		}
	}
	return str;
}

var jsToCss = memoize(function (s) {
	return s.replace(/([A-Z])/g, '-$1').toLowerCase();
});

function assign(obj, props) {
	for (var i in props) {
		obj[i] = props[i];
	}return obj;
}

function getNodeProps(vnode) {
	var defaultProps = vnode.nodeName.defaultProps,
	    props = assign({}, defaultProps || vnode.attributes);
	if (defaultProps) assign(props, vnode.attributes);
	if (vnode.children) props.children = vnode.children;
	return props;
}

var SHALLOW = { shallow: true };

var UNNAMED = [];

var EMPTY = {};

var VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

renderToString.render = renderToString;

var shallowRender = function (vnode, context) {
	return renderToString(vnode, context, SHALLOW);
};

function renderToString(vnode, context, opts, inner, isSvgMode) {
	var _ref = vnode || EMPTY;

	var nodeName = _ref.nodeName;
	var attributes = _ref.attributes;
	var children = _ref.children;
	var isComponent = false;
	context = context || {};
	opts = opts || {};

	var pretty = opts.pretty,
	    indentChar = typeof pretty === 'string' ? pretty : '\t';

	if (vnode == null || vnode === false) {
		return '';
	}

	if (!nodeName) {
		return encodeEntities(vnode);
	}

	if (typeof nodeName === 'function') {
		isComponent = true;
		if (opts.shallow && (inner || opts.renderRootComponent === false)) {
			nodeName = getComponentName(nodeName);
		} else {
			var props = getNodeProps(vnode),
			    rendered = void 0;

			if (!nodeName.prototype || typeof nodeName.prototype.render !== 'function') {
				rendered = nodeName(props, context);
			} else {
				var c = new nodeName(props, context);

				c._disable = c.__x = true;
				c.props = props;
				c.context = context;
				if (c.componentWillMount) c.componentWillMount();
				rendered = c.render(c.props, c.state, c.context);

				if (c.getChildContext) {
					context = assign(assign({}, context), c.getChildContext());
				}
			}

			return renderToString(rendered, context, opts, opts.shallowHighOrder !== false);
		}
	}

	var s = '',
	    html = void 0;

	if (attributes) {
		var attrs = objectKeys(attributes);

		if (opts && opts.sortAttributes === true) attrs.sort();

		for (var i = 0; i < attrs.length; i++) {
			var name = attrs[i],
			    v = attributes[name];
			if (name === 'children') continue;
			if (!(opts && opts.allAttributes) && (name === 'key' || name === 'ref')) continue;

			if (name === 'className') {
				if (attributes['class']) continue;
				name = 'class';
			} else if (isSvgMode && name.match(/^xlink\:?(.+)/)) {
				name = name.toLowerCase().replace(/^xlink\:?(.+)/, 'xlink:$1');
			}

			if (name === 'class' && v && typeof v === 'object') {
				v = hashToClassName(v);
			} else if (name === 'style' && v && typeof v === 'object') {
				v = styleObjToCss(v);
			}

			var hooked = opts.attributeHook && opts.attributeHook(name, v, context, opts, isComponent);
			if (hooked || hooked === '') {
				s += hooked;
				continue;
			}

			if (name === 'dangerouslySetInnerHTML') {
				html = v && v.__html;
			} else if ((v || v === 0 || v === '') && typeof v !== 'function') {
				if (v === true || v === '') {
					v = name;

					if (!opts || !opts.xml) {
						s += ' ' + name;
						continue;
					}
				}
				s += ' ' + name + '="' + encodeEntities(v) + '"';
			}
		}
	}

	var sub = s.replace(/^\n\s*/, ' ');
	if (sub !== s && !~sub.indexOf('\n')) s = sub;else if (pretty && ~s.indexOf('\n')) s += '\n';

	s = '<' + nodeName + s + '>';

	if (VOID_ELEMENTS.indexOf(nodeName) > -1) {
		s = s.replace(/>$/, ' />');
	}

	if (html) {
		if (pretty && isLargeString(html)) {
			html = '\n' + indentChar + indent(html, indentChar);
		}
		s += html;
	} else {
		var len = children && children.length,
		    pieces = [],
		    hasLarge = ~s.indexOf('\n');
		for (var _i = 0; _i < len; _i++) {
			var child = children[_i];
			if (!falsey(child)) {
				var childSvgMode = nodeName === 'svg' ? true : nodeName === 'foreignObject' ? false : isSvgMode,
				    ret = renderToString(child, context, opts, true, childSvgMode);
				if (!hasLarge && pretty && isLargeString(ret)) hasLarge = true;
				if (ret) pieces.push(ret);
			}
		}
		if (pretty && hasLarge) {
			for (var _i2 = pieces.length; _i2--;) {
				pieces[_i2] = '\n' + indentChar + indent(pieces[_i2], indentChar);
			}
		}
		if (pieces.length) {
			s += pieces.join('');
		} else if (opts && opts.xml) {
			return s.substring(0, s.length - 1) + ' />';
		}
	}

	if (opts.jsx || VOID_ELEMENTS.indexOf(nodeName) === -1) {
		if (pretty && ~s.indexOf('\n')) s += '\n';
		s += '</' + nodeName + '>';
	}

	return s;
}

function getComponentName(component) {
	var proto = component.prototype,
	    ctor = proto && proto.constructor;
	return component.displayName || component.name || proto && (proto.displayName || proto.name) || getFallbackComponentName(component);
}

function getFallbackComponentName(component) {
	var str = Function.prototype.toString.call(component),
	    name = (str.match(/^\s*function\s+([^\( ]+)/) || EMPTY)[1];
	if (!name) {
		var index = -1;
		for (var i = UNNAMED.length; i--;) {
			if (UNNAMED[i] === component) {
				index = i;
				break;
			}
		}

		if (index < 0) {
			index = UNNAMED.push(component) - 1;
		}
		name = 'UnnamedComponent' + index;
	}
	return name;
}
renderToString.shallowRender = shallowRender;

return renderToString;

})));
//# sourceMappingURL=index.js.map
