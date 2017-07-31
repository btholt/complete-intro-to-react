'use strict';

var _extractCompsFromCSS = require('../extractCompsFromCSS');

var _extractCompsFromCSS2 = _interopRequireDefault(_extractCompsFromCSS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('extractCompsFromCSS', function () {
  it('should work for null or empty', function () {
    expect((0, _extractCompsFromCSS2.default)('')).toEqual([]);
    expect((0, _extractCompsFromCSS2.default)(null)).toEqual([]);
  });

  it('should ignore anything before the first SC', function () {
    expect((0, _extractCompsFromCSS2.default)('\n      Totally ignored, who cares.\n    ')).toEqual([]);
  });

  it('should return a single SC', function () {
    var css = '\n      /* sc-component-id: 123 */\n      .foo { color: red; }\n    ';
    expect((0, _extractCompsFromCSS2.default)(css)).toEqual([{ componentId: '123', cssFromDOM: css.replace(/^\n/, '') }]);
  });

  it('should return a single SC with multiple lines', function () {
    var css = '\n      /* sc-component-id: 123 */\n      .foo { color: red; }\n      .bar { color: blue; }\n    ';
    expect((0, _extractCompsFromCSS2.default)(css)).toEqual([{ componentId: '123', cssFromDOM: css.replace(/^\n/, '') }]);
  });

  it('should return multiple SCs with single lines', function () {
    var a = '\n      /* sc-component-id: 123 */\n      .foo { color: red; }\n    ';
    var b = '\n      /* sc-component-id: 456 */\n      .bar { color: blue; }\n    ';
    expect((0, _extractCompsFromCSS2.default)(a + b)).toEqual([{ componentId: '123', cssFromDOM: a.replace(/^\n/, '') + '\n' }, { componentId: '456', cssFromDOM: b.replace(/^\n/, '') }]);
  });

  it('should return multiple SCs with multiple lines', function () {
    var a = '\n      /* sc-component-id: 123 */\n      .foo { color: red; }\n      .bar { color: blue; }\n    ';
    var b = '\n      /* sc-component-id: 456 */\n      .baz { color: green; }\n      .boo { color: black; }\n    ';
    expect((0, _extractCompsFromCSS2.default)(a + b)).toEqual([{ componentId: '123', cssFromDOM: a.replace(/^\n/, '') + '\n' }, { componentId: '456', cssFromDOM: b.replace(/^\n/, '') }]);
  });

  it('should include whitespace after a component', function () {
    var a = '\n      /* sc-component-id: 123 */\n      .foo { color: red; }\n      .bar { color: blue; }\n      \n      \n      \n    ';
    var b = '\n      /* sc-component-id: 456 */\n      .baz { color: green; }\n      .boo { color: black; }\n      \n      \n      \n    ';
    expect((0, _extractCompsFromCSS2.default)(a + b)).toEqual([{ componentId: '123', cssFromDOM: a.replace(/^\n/, '') + '\n' }, { componentId: '456', cssFromDOM: b.replace(/^\n/, '') }]);
  });
});