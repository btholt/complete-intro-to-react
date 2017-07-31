'use strict';

var _generateAlphabeticName = require('../generateAlphabeticName');

var _generateAlphabeticName2 = _interopRequireDefault(_generateAlphabeticName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('generateAlphabeticName', function () {
  it('should create alphabetic names for number input data', function () {
    expect((0, _generateAlphabeticName2.default)(1000000000)).toEqual('cGNYzm');
    expect((0, _generateAlphabeticName2.default)(2000000000)).toEqual('fnBWYy');
  });
});