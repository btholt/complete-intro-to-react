'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.range');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderChildToJson = function renderChildToJson(child) {
  if (!child) {
    return null;
  }

  if (child.type === 'root') {
    return renderChildToJson(child.children[0]);
  } else if (child.type === 'tag') {
    return {
      type: child.name,
      props: child.attribs,
      children: child.children && child.children.length ? (0, _utils.compact)(child.children.map(renderChildToJson)) : null,
      $$typeof: Symbol.for('react.test.json')
    };
  } else if (child.type === 'text') {
    return child.data;
  }
};

exports.default = function (wrapper) {
  return wrapper.length > 1 ? (0, _lodash2.default)(0, wrapper.length).map(function (node) {
    return renderChildToJson(wrapper[node]);
  }) : renderChildToJson(wrapper[0]);
};