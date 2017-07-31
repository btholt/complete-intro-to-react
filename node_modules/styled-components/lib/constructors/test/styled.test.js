'use strict';

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _domElements = require('../../utils/domElements');

var _domElements2 = _interopRequireDefault(_domElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('styled', function () {
  it('should have all valid HTML5 elements defined as properties', function () {
    _domElements2.default.forEach(function (domElement) {
      expect(_index2.default[domElement]).toBeTruthy();
    });
  });
});