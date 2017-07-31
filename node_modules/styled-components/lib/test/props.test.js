'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      color: ', ';\n    '], ['\n      color: ', ';\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('props', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should execute interpolations and fall back', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.fg || 'black';
    });
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: black; }');
  });
  it('should execute interpolations and inject props', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.fg || 'black';
    });
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, { fg: 'red' }));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: red; }');
  });
});