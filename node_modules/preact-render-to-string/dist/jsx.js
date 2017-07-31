(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.preactRenderToString = factory());
}(this, (function () {

if (typeof Symbol !== 'function') {
	(function () {
		var c = 0;
		Symbol = function (s) {
			return '@@' + s + ++c;
		};
		Symbol.for = function (s) {
			return '@@' + s;
		};
	})();
}

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

function interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var printString = createCommonjsModule(function (module) {
  'use strict';

  var ESCAPED_CHARACTERS = /(\\|\"|\')/g;

  module.exports = function printString(val) {
    return val.replace(ESCAPED_CHARACTERS, '\\$1');
  };
});

var printString$1 = interopDefault(printString);

var require$$0 = Object.freeze({
  default: printString$1
});

var index = createCommonjsModule(function (module) {
  'use strict';

  var printString = interopDefault(require$$0);

  var toString = Object.prototype.toString;
  var toISOString = Date.prototype.toISOString;
  var errorToString = Error.prototype.toString;
  var regExpToString = RegExp.prototype.toString;
  var symbolToString = Symbol.prototype.toString;

  var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
  var NEWLINE_REGEXP = /\n/ig;

  var getSymbols = Object.getOwnPropertySymbols || function (obj) {
    return [];
  };

  function isToStringedArrayType(toStringed) {
    return toStringed === '[object Array]' || toStringed === '[object ArrayBuffer]' || toStringed === '[object DataView]' || toStringed === '[object Float32Array]' || toStringed === '[object Float64Array]' || toStringed === '[object Int8Array]' || toStringed === '[object Int16Array]' || toStringed === '[object Int32Array]' || toStringed === '[object Uint8Array]' || toStringed === '[object Uint8ClampedArray]' || toStringed === '[object Uint16Array]' || toStringed === '[object Uint32Array]';
  }

  function printNumber(val) {
    if (val != +val) return 'NaN';
    var isNegativeZero = val === 0 && 1 / val < 0;
    return isNegativeZero ? '-0' : '' + val;
  }

  function printFunction(val) {
    if (val.name === '') {
      return '[Function anonymous]';
    } else {
      return '[Function ' + val.name + ']';
    }
  }

  function printSymbol(val) {
    return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
  }

  function printError(val) {
    return '[' + errorToString.call(val) + ']';
  }

  function printBasicValue(val) {
    if (val === true || val === false) return '' + val;
    if (val === undefined) return 'undefined';
    if (val === null) return 'null';

    var typeOf = typeof val;

    if (typeOf === 'number') return printNumber(val);
    if (typeOf === 'string') return '"' + printString(val) + '"';
    if (typeOf === 'function') return printFunction(val);
    if (typeOf === 'symbol') return printSymbol(val);

    var toStringed = toString.call(val);

    if (toStringed === '[object WeakMap]') return 'WeakMap {}';
    if (toStringed === '[object WeakSet]') return 'WeakSet {}';
    if (toStringed === '[object Function]' || toStringed === '[object GeneratorFunction]') return printFunction(val, min);
    if (toStringed === '[object Symbol]') return printSymbol(val);
    if (toStringed === '[object Date]') return toISOString.call(val);
    if (toStringed === '[object Error]') return printError(val);
    if (toStringed === '[object RegExp]') return regExpToString.call(val);
    if (toStringed === '[object Arguments]' && val.length === 0) return 'Arguments []';
    if (isToStringedArrayType(toStringed) && val.length === 0) return val.constructor.name + ' []';

    if (val instanceof Error) return printError(val);

    return false;
  }

  function printList(list, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var body = '';

    if (list.length) {
      body += edgeSpacing;

      var innerIndent = prevIndent + indent;

      for (var i = 0; i < list.length; i++) {
        body += innerIndent + print(list[i], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

        if (i < list.length - 1) {
          body += ',' + spacing;
        }
      }

      body += edgeSpacing + prevIndent;
    }

    return '[' + body + ']';
  }

  function printArguments(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    return (min ? '' : 'Arguments ') + printList(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
  }

  function printArray(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    return (min ? '' : val.constructor.name + ' ') + printList(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
  }

  function printMap(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var result = 'Map {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += edgeSpacing;

      var innerIndent = prevIndent + indent;

      while (!current.done) {
        var key = print(current.value[0], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
        var value = print(current.value[1], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

        result += innerIndent + key + ' => ' + value;

        current = iterator.next();

        if (!current.done) {
          result += ',' + spacing;
        }
      }

      result += edgeSpacing + prevIndent;
    }

    return result + '}';
  }

  function printObject(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var constructor = min ? '' : val.constructor ? val.constructor.name + ' ' : 'Object ';
    var result = constructor + '{';
    var keys = Object.keys(val).sort();
    var symbols = getSymbols(val);

    if (symbols.length) {
      keys = keys.filter(function (key) {
        return !(typeof key === 'symbol' || toString.call(key) === '[object Symbol]');
      }).concat(symbols);
    }

    if (keys.length) {
      result += edgeSpacing;

      var innerIndent = prevIndent + indent;

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var name = print(key, indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
        var value = print(val[key], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

        result += innerIndent + name + ': ' + value;

        if (i < keys.length - 1) {
          result += ',' + spacing;
        }
      }

      result += edgeSpacing + prevIndent;
    }

    return result + '}';
  }

  function printSet(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var result = 'Set {';
    var iterator = val.entries();
    var current = iterator.next();

    if (!current.done) {
      result += edgeSpacing;

      var innerIndent = prevIndent + indent;

      while (!current.done) {
        result += innerIndent + print(current.value[1], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

        current = iterator.next();

        if (!current.done) {
          result += ',' + spacing;
        }
      }

      result += edgeSpacing + prevIndent;
    }

    return result + '}';
  }

  function printComplexValue(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    refs = refs.slice();
    if (refs.indexOf(val) > -1) {
      return '[Circular]';
    } else {
      refs.push(val);
    }

    currentDepth++;

    var hitMaxDepth = currentDepth > maxDepth;

    if (!hitMaxDepth && val.toJSON && typeof val.toJSON === 'function') {
      return print(val.toJSON(), indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    }

    var toStringed = toString.call(val);
    if (toStringed === '[object Arguments]') {
      return hitMaxDepth ? '[Arguments]' : printArguments(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    } else if (isToStringedArrayType(toStringed)) {
      return hitMaxDepth ? '[Array]' : printArray(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    } else if (toStringed === '[object Map]') {
      return hitMaxDepth ? '[Map]' : printMap(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    } else if (toStringed === '[object Set]') {
      return hitMaxDepth ? '[Set]' : printSet(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    } else if (typeof val === 'object') {
      return hitMaxDepth ? '[Object]' : printObject(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    }
  }

  function printPlugin(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var match = false;
    var plugin = void 0;

    for (var p = 0; p < plugins.length; p++) {
      plugin = plugins[p];

      if (plugin.test(val)) {
        match = true;
        break;
      }
    }

    if (!match) {
      return false;
    }

    function boundPrint(val) {
      return print(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    }

    function boundIndent(str) {
      var indentation = prevIndent + indent;
      return indentation + str.replace(NEWLINE_REGEXP, '\n' + indentation);
    }

    return plugin.print(val, boundPrint, boundIndent, {
      edgeSpacing: edgeSpacing,
      spacing: spacing
    });
  }

  function print(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
    var basic = printBasicValue(val);
    if (basic) return basic;

    var plugin = printPlugin(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
    if (plugin) return plugin;

    return printComplexValue(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
  }

  var DEFAULTS = {
    indent: 2,
    min: false,
    maxDepth: Infinity,
    plugins: []
  };

  function validateOptions(opts) {
    Object.keys(opts).forEach(function (key) {
      if (!DEFAULTS.hasOwnProperty(key)) {
        throw new Error('prettyFormat: Invalid option: ' + key);
      }
    });

    if (opts.min && opts.indent !== undefined && opts.indent !== 0) {
      throw new Error('prettyFormat: Cannot run with min option and indent');
    }
  }

  function normalizeOptions(opts) {
    var result = {};

    Object.keys(DEFAULTS).forEach(function (key) {
      return result[key] = opts.hasOwnProperty(key) ? opts[key] : DEFAULTS[key];
    });

    if (result.min) {
      result.indent = 0;
    }

    return result;
  }

  function createIndent(indent) {
    return new Array(indent + 1).join(' ');
  }

  function prettyFormat(val, opts) {
    if (!opts) {
      opts = DEFAULTS;
    } else {
      validateOptions(opts);
      opts = normalizeOptions(opts);
    }

    var indent = void 0;
    var refs = void 0;
    var prevIndent = '';
    var currentDepth = 0;
    var spacing = opts.min ? ' ' : '\n';
    var edgeSpacing = opts.min ? '' : '\n';

    if (opts && opts.plugins.length) {
      indent = createIndent(opts.indent);
      refs = [];
      var pluginsResult = printPlugin(val, indent, prevIndent, spacing, edgeSpacing, refs, opts.maxDepth, currentDepth, opts.plugins, opts.min);
      if (pluginsResult) return pluginsResult;
    }

    var basicResult = printBasicValue(val);
    if (basicResult) return basicResult;

    if (!indent) indent = createIndent(opts.indent);
    if (!refs) refs = [];
    return printComplexValue(val, indent, prevIndent, spacing, edgeSpacing, refs, opts.maxDepth, currentDepth, opts.plugins, opts.min);
  }

  module.exports = prettyFormat;
});

var prettyFormat = interopDefault(index);

var preactPlugin = {
	test: function (object) {
		return object && typeof object === 'object' && 'nodeName' in object && 'attributes' in object && 'children' in object && !('nodeType' in object);
	},
	print: function (val, print, indent) {
		return renderToString(val, preactPlugin.context, preactPlugin.opts, true);
	}
};

var prettyFormatOpts = {
	plugins: [preactPlugin]
};

function attributeHook(name, value, context, opts, isComponent) {
	var type = typeof value;

	if (value == null || type === 'function' && !opts.functions) return '';

	if (opts.skipFalseAttributes && !isComponent && (value === false || (name === 'class' || name === 'style') && value === '')) return '';

	var indentChar = typeof opts.pretty === 'string' ? opts.pretty : '\t';
	if (type !== 'string') {
		if (type === 'function' && !opts.functionNames) {
			value = 'Function';
		} else {
			preactPlugin.context = context;
			preactPlugin.opts = opts;
			value = prettyFormat(value, prettyFormatOpts);
			if (~value.indexOf('\n')) {
				value = indent('\n' + value, indentChar) + '\n';
			}
		}
		return indent('\n' + name + '={' + value + '}', indentChar);
	}
	return '\n' + indentChar + name + '="' + encodeEntities(value) + '"';
}

var defaultOpts = {
	attributeHook: attributeHook,
	jsx: true,
	xml: false,
	functions: true,
	functionNames: true,
	skipFalseAttributes: true,
	pretty: '  '
};

function renderToJsxString(vnode, context, opts, inner) {
	opts = assign(assign({}, defaultOpts), opts || {});
	return renderToString(vnode, context, opts, inner);
}

return renderToJsxString;

})));
//# sourceMappingURL=jsx.js.map
