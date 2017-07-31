'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.omitby');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isnil');

var _lodash4 = _interopRequireDefault(_lodash3);

var _objectValues = require('object-values');

var _objectValues2 = _interopRequireDefault(_objectValues);

var _reactCompat = require('enzyme/build/react-compat');

var _Utils = require('enzyme/build/Utils');

var _Debug = require('enzyme/build/Debug');

var _ShallowTraversal = require('enzyme/build/ShallowTraversal');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function instToJson(inst) {
  if (typeof inst === 'string' || typeof inst === 'number') {
    return inst;
  }
  if (!inst) {
    return '';
  }

  if (inst._stringText) {
    return inst._stringText;
  }

  if (!inst.getPublicInstance) {
    var internal = (0, _Utils.internalInstance)(inst);
    return instToJson(internal);
  }
  var publicInst = inst.getPublicInstance();

  if (typeof publicInst === 'string' || typeof publicInst === 'number') {
    return publicInst;
  }
  if (!publicInst && !inst._renderedComponent) {
    return '';
  }

  var currentElement = inst._currentElement;
  var type = (0, _Debug.typeName)(currentElement);
  var props = (0, _lodash2.default)((0, _Utils.propsOfNode)(currentElement), function (val, key) {
    return key === 'children' || val === undefined;
  });
  var children = [];
  if ((0, _reactCompat.isDOMComponent)(publicInst)) {
    var renderedChildren = inst._renderedChildren;
    if ((0, _lodash4.default)(renderedChildren)) {
      children.push.apply(children, _toConsumableArray((0, _ShallowTraversal.childrenOfNode)(currentElement)));
    } else {
      children.push.apply(children, _toConsumableArray((0, _objectValues2.default)(renderedChildren)));
    }
  } else if ((0, _reactCompat.isElement)(currentElement) && typeof currentElement.type === 'function') {
    children.push(inst._renderedComponent);
  }

  var childrenArray = (0, _utils.compact)(children.map(function (n) {
    return instToJson(n);
  }));

  return {
    type: type,
    props: props,
    children: childrenArray.length ? childrenArray : null,
    $$typeof: Symbol.for('react.test.json')
  };
}

exports.default = function (wrapper) {
  return wrapper.length > 1 ? wrapper.nodes.map(instToJson) : instToJson(wrapper.node);
};