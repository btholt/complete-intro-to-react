'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compact = exports.isEnzymeWrapper = exports.isCheerioWrapper = exports.isReactWrapper = exports.isShallowWrapper = undefined;

var _lodash = require('lodash.filter');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isnil');

var _lodash4 = _interopRequireDefault(_lodash3);

var _ShallowWrapper = require('enzyme/build/ShallowWrapper');

var _ShallowWrapper2 = _interopRequireDefault(_ShallowWrapper);

var _ReactWrapper = require('enzyme/build/ReactWrapper');

var _ReactWrapper2 = _interopRequireDefault(_ReactWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SHALLOW_WRAPPER_NAME = _ShallowWrapper2.default.name;
var REACT_WRAPPER_NAME = _ReactWrapper2.default.name;

var isShallowWrapper = exports.isShallowWrapper = function isShallowWrapper(wrapper) {
  return wrapper && wrapper.constructor && wrapper.constructor.name === SHALLOW_WRAPPER_NAME;
};
var isReactWrapper = exports.isReactWrapper = function isReactWrapper(wrapper) {
  return wrapper && wrapper.constructor && wrapper.constructor.name === REACT_WRAPPER_NAME;
};
var isCheerioWrapper = exports.isCheerioWrapper = function isCheerioWrapper(wrapper) {
  return wrapper && wrapper.cheerio;
};

var isEnzymeWrapper = exports.isEnzymeWrapper = function isEnzymeWrapper(wrapper) {
  return isShallowWrapper(wrapper) || isReactWrapper(wrapper) || isCheerioWrapper(wrapper);
};

var compact = exports.compact = function compact(array) {
  return (0, _lodash2.default)(array, function (item) {
    return !(0, _lodash4.default)(item) && item !== '';
  });
};