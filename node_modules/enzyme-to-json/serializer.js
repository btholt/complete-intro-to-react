'use strict';

var _utils = require('./build/utils');

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  test: function test(wrapper) {
    return (0, _utils.isEnzymeWrapper)(wrapper);
  },
  print: function print(wrapper, serializer) {
    return serializer((0, _2.default)(wrapper));
  }
}; // eslint-disable-line import/no-unresolved
