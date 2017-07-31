'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      transition: opacity 0.3s;\n    '], ['\n      transition: opacity 0.3s;\n    ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    '], ['\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n      --custom-prop: some-val;\n    '], ['\n      --custom-prop: some-val;\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('css features', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should add vendor prefixes in the right order', function () {
    var Comp = styled.div(_templateObject);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { -webkit-transition: opacity 0.3s; transition: opacity 0.3s; }');
  });

  it('should add vendor prefixes for display', function () {
    var Comp = styled.div(_templateObject2);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('\n      .sc-a {}\n      .b {\n        display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-align-items: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center;\n      }\n    ');
  });

  it('should pass through custom properties', function () {
    var Comp = styled.div(_templateObject3);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { --custom-prop: some-val; }');
  });
});