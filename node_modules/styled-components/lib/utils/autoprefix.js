'use strict';

exports.__esModule = true;

var _camelizeStyleName = require('fbjs/lib/camelizeStyleName');

var _camelizeStyleName2 = _interopRequireDefault(_camelizeStyleName);

var _hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');

var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

var _static = require('inline-style-prefixer/static');

var _static2 = _interopRequireDefault(_static);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_Container = require('../vendor/postcss/container').babelPluginFlowReactPropTypes_proptype_Container || require('prop-types').any;

// eslint-disable-next-line


exports.default = function (root) {
  root.walkDecls(function (decl) {
    var _objStyle;

    /* No point even checking custom props */
    if (/^--/.test(decl.prop)) return;

    var objStyle = (_objStyle = {}, _objStyle[(0, _camelizeStyleName2.default)(decl.prop)] = decl.value, _objStyle);
    var prefixed = (0, _static2.default)(objStyle);
    Object.keys(prefixed).forEach(function (newProp) {
      var newVals = prefixed[newProp];
      var newValArray = Array.isArray(newVals) ? newVals : [newVals];
      newValArray.forEach(function (newVal) {
        decl.cloneBefore({
          prop: (0, _hyphenateStyleName2.default)(newProp),
          value: newVal
        });
      });
    });
    decl.remove();
  });
};

module.exports = exports['default'];