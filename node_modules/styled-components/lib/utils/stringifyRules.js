'use strict';

exports.__esModule = true;

var _stylis = require('stylis');

var _stylis2 = _interopRequireDefault(_stylis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_Interpolation = require('../types').babelPluginFlowReactPropTypes_proptype_Interpolation || require('prop-types').any;

var stringifyRules = function stringifyRules(rules, selector, prefix) {
  var flatCSS = rules.join('').replace(/^\s*\/\/.*$/gm, ''); // replace JS comments

  var cssStr = selector && prefix ? prefix + ' ' + selector + ' { ' + flatCSS + ' }' : flatCSS;

  var css = (0, _stylis2.default)(prefix || !selector ? '' : selector, cssStr, false, false);

  return css;
};

exports.default = stringifyRules;
module.exports = exports['default'];