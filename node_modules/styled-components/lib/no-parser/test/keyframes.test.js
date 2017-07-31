'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keyframes2 = require('../../constructors/keyframes');

var _keyframes3 = _interopRequireDefault(_keyframes2);

var _stringifyRules = require('../stringifyRules');

var _stringifyRules2 = _interopRequireDefault(_stringifyRules);

var _css = require('../css');

var _css2 = _interopRequireDefault(_css);

var _utils = require('../../test/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = 0;

var keyframes = (0, _keyframes3.default)(function () {
  return 'keyframe_' + index++;
}, _stringifyRules2.default, _css2.default);

describe('keyframes', function () {
  beforeEach(function () {
    (0, _utils.resetNoParserStyled)();
  });

  it('should correctly assemble preprocessed CSS', function () {
    var name = keyframes([
    // $FlowFixMe
    ['@-webkit-keyframes '],
    // $FlowFixMe
    [' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}} @keyframes '],
    // $FlowFixMe
    [' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}}']]);

    (0, _utils.expectCSSMatches)('@-webkit-keyframes ' + name + ' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}} @keyframes ' + name + ' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}}');
  });
});