'use strict';

const printString = require('../printString');

const reactTestInstance = Symbol.for('react.test.json');

function printChildren(children, print, indent, opts) {
  return children.map(child => printInstance(child, print, indent, opts)).join(opts.edgeSpacing);
}

function printProps(props, print, indent, opts) {
  return Object.keys(props).sort().map(name => {
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

function printInstance(instance, print, indent, opts) {
  if (typeof instance == 'number') {
    return print(instance);
  } else if (typeof instance === 'string') {
    return printString(instance);
  }

  let result = '<' + instance.type;

  if (instance.props) {
    result += printProps(instance.props, print, indent, opts);
  }

  if (instance.children) {
    const children = printChildren(instance.children, print, indent, opts);
    result += '>' + opts.edgeSpacing + indent(children) + opts.edgeSpacing + '</' + instance.type + '>';
  } else {
    result += ' />';
  }

  return result;
}

module.exports = {
  test(object) {
    return object && object.$$typeof === reactTestInstance;
  },
  print(val, print, indent, opts) {
    return printInstance(val, print, indent, opts);
  }
};
