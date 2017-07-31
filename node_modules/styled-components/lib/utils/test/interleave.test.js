'use strict';

var _interleave = require('../interleave');

var _interleave2 = _interopRequireDefault(_interleave);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('interleave', function () {
  it('blindly interleave', function () {
    expect((0, _interleave2.default)([], [])).toEqual([undefined]);
    expect((0, _interleave2.default)(['foo'], [])).toEqual(['foo']);
    expect((0, _interleave2.default)(['foo'], [1])).toEqual(['foo', 1, undefined]);
    expect((0, _interleave2.default)(['foo', 'bar'], [1])).toEqual(['foo', 1, 'bar']);
  });
  it('should be driven off the number of interpolations', function () {
    expect((0, _interleave2.default)(['foo', 'bar'], [])).toEqual(['foo']);
    expect((0, _interleave2.default)(['foo', 'bar', 'baz'], [1])).toEqual(['foo', 1, 'bar']);
    expect((0, _interleave2.default)([], [1])).toEqual([undefined, 1, undefined]);
    expect((0, _interleave2.default)(['foo'], [1, 2, 3])).toEqual(['foo', 1, undefined, 2, undefined, 3, undefined]);
  });
});