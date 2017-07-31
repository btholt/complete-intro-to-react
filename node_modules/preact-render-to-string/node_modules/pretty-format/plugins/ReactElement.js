'use strict';

const printString = require('../printString');

const reactElement = Symbol.for('react.element');

function traverseChildren(opaqueChildren, cb) {
  if (Array.isArray(opaqueChildren)) {
    opaqueChildren.forEach(child => traverseChildren(child, cb));
  } else if (opaqueChildren != null && opaqueChildren !== false) {
    cb(opaqueChildren);
  }
}

function printChildren(flatChildren, print, indent, opts) {
  return flatChildren.map(node => {
    if (typeof node === 'object') {
      return printElement(node, print, indent, opts);
    } else if (typeof node === 'string') {
      return printString(node);
    } else {
      return print(node);
    }
  }).join(opts.edgeSpacing);
}

function printProps(props, print, indent, opts) {
  return Object.keys(props).sort().map(name => {
    if (name === 'children') {
      return '';
    }

    const prop = props[name];
    let printed = print(prop);

    if (typeof prop !== 'string') {
      if (printed.indexOf('\n') !== -1) {
        printed = '{' + opts.edgeSpacing + indent(indent(printed) + opts.edgeSpacing + '}');
      } else {
        printed = '{' + printed + '}';
      }
    }

    return opts.spacing + indent(name + '=') + printed;
  }).join('');
}

function printElement(element, print, indent, opts) {
  let result = '<' + element.type;
  result += printProps(element.props, print, indent, opts);

  const opaqueChildren = element.props.children;
  if (opaqueChildren) {
    let flatChildren = [];
    traverseChildren(opaqueChildren, child => {
      flatChildren.push(child);
    });
    const children = printChildren(flatChildren, print, indent, opts);
    result += '>' + opts.edgeSpacing + indent(children) + opts.edgeSpacing + '</' + element.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactElement;
  },
  print(val, print, indent, opts) {
    return printElement(val, print, indent, opts);
  }
};
