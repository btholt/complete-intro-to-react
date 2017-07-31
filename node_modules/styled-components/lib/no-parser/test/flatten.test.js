'use strict';

var _flatten = require('../flatten');

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('preparsed flatten without executionContext', function () {
  it('doesnt merge strings', function () {
    expect((0, _flatten2.default)([['foo', 'bar', 'baz']])).toEqual([['foo', 'bar', 'baz']]);
  });

  it('drops nulls', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)([['foo', false, 'bar', undefined, 'baz', null]])).toEqual([['foo', 'bar', 'baz']]);
  });

  it('doesnt drop any numbers', function () {
    expect((0, _flatten2.default)([['foo', 0, 'bar', NaN, 'baz', -1]])).toEqual([['foo', '0', 'bar', 'NaN', 'baz', '-1']]);
  });

  it('toStrings everything', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)([[1, true]])).toEqual([['1', 'true']]);
  });

  it('hypenates objects', function () {
    var obj = {
      fontSize: '14px',
      WebkitFilter: 'blur(2px)'
    };
    var css = 'font-size: 14px; -webkit-filter: blur(2px);';
    // $FlowFixMe
    expect((0, _flatten2.default)([[obj]])).toEqual([[css]]);
    // $FlowFixMe
    expect((0, _flatten2.default)([['some:thing;', obj, 'something: else;']])).toEqual([['some:thing;', css, 'something: else;']]);
  });

  it('flattens nested rulesets', function () {
    expect((0, _flatten2.default)([['a', [['c']], 'b']])).toEqual([['a', 'b'], ['c']]);
  });

  it('flattens double nested rulesets', function () {
    expect((0, _flatten2.default)([['a', [['c', [['d']]]], 'b']])).toEqual([['a', 'b'], ['c'], ['d']]);
  });

  it('flattens subarrays', function () {
    expect((0, _flatten2.default)([[1, 2, [3, 4, 5], 'come:on;', 'lets:ride;']])).toEqual([['1', '2', '3', '4', '5', 'come:on;', 'lets:ride;']]);
  });

  it('defers functions', function () {
    var func = function func() {
      return 'bar';
    };

    expect((0, _flatten2.default)([['foo', func, 'baz']])).toEqual([['foo', func, 'baz']]);
  });
});


describe('preparsed flatten with executionContext', function () {
  it('merges strings', function () {
    expect((0, _flatten2.default)([['foo', 'bar', 'baz']], {})).toEqual(['foobarbaz']);
  });

  it('drops nulls', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)([['foo', false, 'bar', undefined, 'baz', null]], {})).toEqual(['foobarbaz']);
  });

  it('doesnt drop any numbers', function () {
    expect((0, _flatten2.default)([['foo', 0, 'bar', NaN, 'baz', -1]], {})).toEqual(['foo0barNaNbaz-1']);
  });

  it('toStrings everything', function () {
    // $FlowInvalidInputTest
    expect((0, _flatten2.default)([[1, true]], {})).toEqual(['1true']);
  });

  it('hypenates objects', function () {
    var obj = {
      fontSize: '14px',
      WebkitFilter: 'blur(2px)'
    };
    var css = 'font-size: 14px; -webkit-filter: blur(2px);';
    // $FlowFixMe
    expect((0, _flatten2.default)([[obj]], {})).toEqual([css]);
    // $FlowFixMe
    expect((0, _flatten2.default)([['some:thing;', obj, 'something: else;']], {})).toEqual(['some:thing;' + css + 'something: else;']);
  });

  it('flattens nested rulesets', function () {
    expect((0, _flatten2.default)([['a', [['c']], 'b']], {})).toEqual(['ab', 'c']);
  });

  it('flattens double nested rulesets', function () {
    expect((0, _flatten2.default)([['a', [['c', 'd', [['e', 'f'], ['g', 'h']]]], 'b']], {})).toEqual(['ab', 'cd', 'ef', 'gh']);
  });

  it('flattens subarrays', function () {
    expect((0, _flatten2.default)([[1, 2, [3, 4, 5], 'come:on;', 'lets:ride;']], {})).toEqual(['12345come:on;lets:ride;']);
  });

  it('executes functions', function () {
    var func = function func() {
      return 'bar';
    };
    expect((0, _flatten2.default)([['foo', func, 'baz']], {})).toEqual(['foobarbaz']);
  });

  it('resolves rulesets after executing functions', function () {
    var func = function func() {
      return [['add me to the end']];
    };
    expect((0, _flatten2.default)([['foo', func, 'baz']], {})).toEqual(['foobaz', 'add me to the end']);
  });

  it('resolves double nested rulesets after executing functions', function () {
    var func = function func() {
      return [['a', [['b']]]];
    };
    expect((0, _flatten2.default)([['foo', func, 'baz']], {})).toEqual(['foobaz', 'a', 'b']);
  });
});