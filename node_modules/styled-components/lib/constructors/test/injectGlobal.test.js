'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      html {\n        ', '\n      }\n    '], ['\n      html {\n        ', '\n      }\n    ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      a {\n        ', '\n      }\n    '], ['\n      a {\n        ', '\n      }\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n      ', '\n    '], ['\n      ', '\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _injectGlobal2 = require('../injectGlobal');

var _injectGlobal3 = _interopRequireDefault(_injectGlobal2);

var _stringifyRules = require('../../utils/stringifyRules');

var _stringifyRules2 = _interopRequireDefault(_stringifyRules);

var _css = require('../css');

var _css2 = _interopRequireDefault(_css);

var _utils = require('../../test/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var injectGlobal = (0, _injectGlobal3.default)(_stringifyRules2.default, _css2.default);

var styled = (0, _utils.resetStyled)();
var rule1 = 'width: 100%;';
var rule2 = 'padding: 10px;';
var rule3 = 'color: blue;';

describe('injectGlobal', function () {
  beforeEach(function () {
    (0, _utils.resetStyled)();
  });

  it('should inject rules into the head', function () {
    injectGlobal(_templateObject, rule1);
    (0, _utils.expectCSSMatches)('\n      html {\n        ' + rule1 + '\n      }\n    ');
  });

  it('should non-destructively inject styles when called repeatedly', function () {
    injectGlobal(_templateObject, rule1);

    injectGlobal(_templateObject2, rule2);
    (0, _utils.expectCSSMatches)('\n      html {\n        ' + rule1 + '\n      }\n      a {\n        ' + rule2 + '\n      }\n    ');
  });

  it('should non-destructively inject styles when called after a component', function () {
    var Comp = styled.div(_templateObject3, rule3);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));

    injectGlobal(_templateObject, rule1);

    (0, _utils.expectCSSMatches)('\n      .sc-a {}\n      .b {\n        ' + rule3 + '\n      }\n      html {\n        ' + rule1 + '\n      }\n    ');
  });
});