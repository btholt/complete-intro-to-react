'use strict';

const printString = require('./printString');

const toString = Object.prototype.toString;
const toISOString = Date.prototype.toISOString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = Symbol.prototype.toString;

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
const NEWLINE_REGEXP = /\n/ig;

const getSymbols = Object.getOwnPropertySymbols || (obj => []);

function isToStringedArrayType(toStringed) {
  return (
    toStringed === '[object Array]' ||
    toStringed === '[object ArrayBuffer]' ||
    toStringed === '[object DataView]' ||
    toStringed === '[object Float32Array]' ||
    toStringed === '[object Float64Array]' ||
    toStringed === '[object Int8Array]' ||
    toStringed === '[object Int16Array]' ||
    toStringed === '[object Int32Array]' ||
    toStringed === '[object Uint8Array]' ||
    toStringed === '[object Uint8ClampedArray]' ||
    toStringed === '[object Uint16Array]' ||
    toStringed === '[object Uint32Array]'
  );
}

function printNumber(val) {
  if (val != +val) return 'NaN';
  const isNegativeZero = val === 0 && (1 / val) < 0;
  return isNegativeZero ? '-0' : '' + val;
}

function printFunction(val) {
  if (val.name === '') {
    return '[Function anonymous]'
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

  const typeOf = typeof val;

  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return '"' + printString(val) + '"';
  if (typeOf === 'function') return printFunction(val);
  if (typeOf === 'symbol') return printSymbol(val);

  const toStringed = toString.call(val);

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
  let body = '';

  if (list.length) {
    body += edgeSpacing;

    const innerIndent = prevIndent + indent;

    for (let i = 0; i < list.length; i++) {
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
  let result = 'Map {';
  const iterator = val.entries();
  let current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    const innerIndent = prevIndent + indent;

    while (!current.done) {
      const key = print(current.value[0], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
      const value = print(current.value[1], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

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
  const constructor = min ? '' : (val.constructor ?  val.constructor.name + ' ' : 'Object ');
  let result = constructor + '{';
  let keys = Object.keys(val).sort();
  const symbols = getSymbols(val);

  if (symbols.length) {
    keys = keys
      .filter(key => !(typeof key === 'symbol' || toString.call(key) === '[object Symbol]'))
      .concat(symbols);
  }

  if (keys.length) {
    result += edgeSpacing;

    const innerIndent = prevIndent + indent;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const name = print(key, indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
      const value = print(val[key], indent, innerIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);

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
  let result = 'Set {';
  const iterator = val.entries();
  let current = iterator.next();

  if (!current.done) {
    result += edgeSpacing;

    const innerIndent = prevIndent + indent;

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

  const hitMaxDepth = currentDepth > maxDepth;

  if (!hitMaxDepth && val.toJSON && typeof val.toJSON === 'function') {
    return print(val.toJSON(), indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
  }

  const toStringed = toString.call(val);
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
  let match = false;
  let plugin;

  for (let p = 0; p < plugins.length; p++) {
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
    const indentation = prevIndent + indent;
    return indentation + str.replace(NEWLINE_REGEXP, '\n' + indentation);
  }

  return plugin.print(val, boundPrint, boundIndent, {
    edgeSpacing: edgeSpacing,
    spacing: spacing
  });
}

function print(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min) {
  const basic = printBasicValue(val);
  if (basic) return basic;

  const plugin = printPlugin(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
  if (plugin) return plugin;

  return printComplexValue(val, indent, prevIndent, spacing, edgeSpacing, refs, maxDepth, currentDepth, plugins, min);
}

const DEFAULTS = {
  indent: 2,
  min: false,
  maxDepth: Infinity,
  plugins: []
};

function validateOptions(opts) {
  Object.keys(opts).forEach(key => {
    if (!DEFAULTS.hasOwnProperty(key)) {
      throw new Error('prettyFormat: Invalid option: ' + key);
    }
  });

  if (opts.min && opts.indent !== undefined && opts.indent !== 0) {
    throw new Error('prettyFormat: Cannot run with min option and indent');
  }
}

function normalizeOptions(opts) {
  const result = {};

  Object.keys(DEFAULTS).forEach(key =>
    result[key] = opts.hasOwnProperty(key) ? opts[key] : DEFAULTS[key]
  );

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
    validateOptions(opts)
    opts = normalizeOptions(opts);
  }

  let indent;
  let refs;
  const prevIndent = '';
  const currentDepth = 0;
  const spacing = opts.min ? ' ' : '\n';
  const edgeSpacing = opts.min ? '' : '\n';

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
