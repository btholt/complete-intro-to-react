'use strict';

var _flatten = require('../flatten');

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe('flatten', function () {
  it('doesnt merge strings', function () {
    expect((0, _flatten2.default)(['foo', 'bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });
  it('drops nulls', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)(['foo', false, 'bar', undefined, 'baz', null])).toEqual(['foo', 'bar', 'baz']);
  });
  it('doesnt drop any numbers', function () {
    expect((0, _flatten2.default)(['foo', 0, 'bar', NaN, 'baz', -1])).toEqual(['foo', '0', 'bar', 'NaN', 'baz', '-1']);
  });
  it('toStrings everything', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)([1, true])).toEqual(['1', 'true']);
  });
  it('hypenates objects', function () {
    var obj = {
      fontSize: '14px',
      WebkitFilter: 'blur(2px)'
    };
    var css = 'font-size: 14px; -webkit-filter: blur(2px);';
    // $FlowFixMe
    expect((0, _flatten2.default)([obj])).toEqual([css]);
    // $FlowFixMe
    expect((0, _flatten2.default)(['some:thing;', obj, 'something: else;'])).toEqual(['some:thing;', css, 'something: else;']);
  });
  it('handles nested objects', function () {
    var obj = {
      fontSize: '14px',
      '@media screen and (min-width: 250px)': {
        fontSize: '16px'
      },
      '&:hover': {
        fontWeight: 'bold'
      }
    };
    var css = 'font-size: 14px; @media screen and (min-width: 250px) {\n  font-size: 16px;\n} &:hover {\n  font-weight: bold;\n}';
    // $FlowFixMe
    expect((0, _flatten2.default)([obj])).toEqual([css]);
    // $FlowFixMe
    expect((0, _flatten2.default)(['some:thing;', obj, 'something: else;'])).toEqual(['some:thing;', css, 'something: else;']);
  });
  it('toStrings class instances', function () {
    var SomeClass = function () {
      function SomeClass() {
        _classCallCheck(this, SomeClass);
      }

      SomeClass.prototype.toString = function toString() {
        return 'some: thing;';
      };

      return SomeClass;
    }();
    // $FlowFixMe


    expect((0, _flatten2.default)([new SomeClass()])).toEqual(['some: thing;']);
  });
  it('flattens subarrays', function () {
    expect((0, _flatten2.default)([1, 2, [3, 4, 5], 'come:on;', 'lets:ride;'])).toEqual(['1', '2', '3', '4', '5', 'come:on;', 'lets:ride;']);
  });
  it('defers functions', function () {
    var func = function func() {
      return 'bar';
    };
    var funcWFunc = function funcWFunc() {
      return ['static', function (subfunc) {
        return subfunc ? 'bar' : 'baz';
      }];
    };
    expect((0, _flatten2.default)(['foo', func, 'baz'])).toEqual(['foo', func, 'baz']);
    expect((0, _flatten2.default)(['foo', funcWFunc, 'baz'])).toEqual(['foo', funcWFunc, 'baz']);
  });
  it('executes functions', function () {
    var func = function func() {
      return 'bar';
    };
    expect((0, _flatten2.default)(['foo', func, 'baz'], { bool: true })).toEqual(['foo', 'bar', 'baz']);
  });
  it('passes values to function', function () {
    var func = function func(_ref) {
      var bool = _ref.bool;
      return bool ? 'bar' : 'baz';
    };
    expect((0, _flatten2.default)(['foo', func], { bool: true })).toEqual(['foo', 'bar']);
    expect((0, _flatten2.default)(['foo', func], { bool: false })).toEqual(['foo', 'baz']);
  });
  it('recursively calls functions', function () {
    var func = function func() {
      return ['static', function (_ref2) {
        var bool = _ref2.bool;
        return bool ? 'bar' : 'baz';
      }];
    };
    expect((0, _flatten2.default)(['foo', func], { bool: true })).toEqual(['foo', 'static', 'bar']);
    expect((0, _flatten2.default)(['foo', func], { bool: false })).toEqual(['foo', 'static', 'baz']);
  });
});