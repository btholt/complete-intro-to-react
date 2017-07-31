'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      width: ', ';\n    '], ['\n      width: ', ';\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

var _StyleSheet = require('../models/StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('warn too many classes', function () {
  var nativeWarn = console.warn;
  var warnCallCount = void 0;
  /**
   * Make sure the setup is the same for every test
   */
  beforeEach(function () {
    console.warn = function () {
      return warnCallCount++;
    };
    warnCallCount = 0;
    styled = (0, _utils.resetStyled)();
  });

  afterEach(function () {
    console.warn = nativeWarn;
  });

  it('should warn once', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.size;
    });
    for (var i = 0; i < 300; i++) {
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, { size: i }));
    }
    expect(warnCallCount).toEqual(1);
  });

  it('should warn if number of classes is 200', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.size;
    });
    for (var i = 0; i < 200; i++) {
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, { size: i }));
    }
    expect(warnCallCount).toEqual(1);
  });

  it('should not warn if number of classes is below 200', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.size;
    });
    for (var i = 0; i < 199; i++) {
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, { size: i }));
    }

    expect(warnCallCount).toEqual(0);
  });
});