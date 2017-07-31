'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omitby');

var _lodash4 = _interopRequireDefault(_lodash3);

var _object = require('object.entries');

var _object2 = _interopRequireDefault(_object);

var _Utils = require('enzyme/build/Utils');

var _Debug = require('enzyme/build/Debug');

var _ShallowTraversal = require('enzyme/build/ShallowTraversal');

var _reactCompat = require('enzyme/build/react-compat');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function nodeToJson(node) {
  if (!node) {
    return node;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  if (!(0, _reactCompat.isElement)(node)) {
    if (Array.isArray(node)) {
      return node.map(nodeToJson);
    }

    if ((0, _lodash2.default)(node)) {
      return (0, _object2.default)(node).reduce(function (obj, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            val = _ref2[1];

        obj[key] = nodeToJson(val);
        return obj;
      }, {});
    }

    return node;
  }

  var children = (0, _utils.compact)((0, _ShallowTraversal.childrenOfNode)(node).map(function (n) {
    return nodeToJson(n);
  }));
  var type = (0, _Debug.typeName)(node);
  var props = (0, _lodash4.default)((0, _Utils.propsOfNode)(node), function (val, key) {
    return key === 'children' || val === undefined;
  });

  return {
    type: type,
    props: nodeToJson(props),
    children: children.length ? children : null,
    $$typeof: Symbol.for('react.test.json')
  };
}

exports.default = function (wrapper) {
  return wrapper.length > 1 ? wrapper.nodes.map(nodeToJson) : nodeToJson(wrapper.node);
};