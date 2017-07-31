'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      0% {\n        opacity: 0;\n      }\n      100% {\n        opacity: 1;\n      }\n    '], ['\n      0% {\n        opacity: 0;\n      }\n      100% {\n        opacity: 1;\n      }\n    ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['', ''], ['', '']);

var _keyframes2 = require('../keyframes');

var _keyframes3 = _interopRequireDefault(_keyframes2);

var _stringifyRules = require('../../utils/stringifyRules');

var _stringifyRules2 = _interopRequireDefault(_stringifyRules);

var _css = require('../css');

var _css2 = _interopRequireDefault(_css);

var _utils = require('../../test/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

/**
 * Setup
 */
var index = 0;
var keyframes = (0, _keyframes3.default)(function () {
  return 'keyframe_' + index++;
}, _stringifyRules2.default, _css2.default);

describe('keyframes', function () {
  beforeEach(function () {
    (0, _utils.resetStyled)();
    index = 0;
  });

  it('should return its name', function () {
    expect(keyframes(_templateObject)).toEqual('keyframe_0');
  });

  it('should insert the correct styles', function () {
    var rules = '\n      0% {\n        opacity: 0;\n      }\n      100% {\n        opacity: 1;\n      }\n    ';

    var name = keyframes(_templateObject2, rules);
    (0, _utils.expectCSSMatches)('\n      @-webkit-keyframes ' + name + ' {\n        0% {\n          opacity: 0;\n        }\n        100% {\n          opacity: 1;\n        }\n      }\n\n      @keyframes ' + name + ' {\n        0% {\n          opacity: 0;\n        }\n        100% {\n          opacity: 1;\n        }\n      }\n    ');
  });
});