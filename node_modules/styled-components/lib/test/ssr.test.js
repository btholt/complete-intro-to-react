'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      color: red;\n    '], ['\n      color: red;\n    ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      body { background: papayawhip; }\n    '], ['\n      body { background: papayawhip; }\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n      color: blue;\n    '], ['\n      color: blue;\n    ']),
    _templateObject4 = _taggedTemplateLiteralLoose(['html::before { content: \'Before both renders\'; }'], ['html::before { content: \'Before both renders\'; }']),
    _templateObject5 = _taggedTemplateLiteralLoose(['html::before { content: \'During first render\'; }'], ['html::before { content: \'During first render\'; }']),
    _templateObject6 = _taggedTemplateLiteralLoose(['html::before { content: \'Between renders\'; }'], ['html::before { content: \'Between renders\'; }']),
    _templateObject7 = _taggedTemplateLiteralLoose(['html::before { content: \'During second render\'; }'], ['html::before { content: \'During second render\'; }']),
    _templateObject8 = _taggedTemplateLiteralLoose(['html::before { content: \'After both renders\'; }'], ['html::before { content: \'After both renders\'; }']),
    _templateObject9 = _taggedTemplateLiteralLoose(['\n      animation: ', ' 1s both;\n    '], ['\n      animation: ', ' 1s both;\n    ']),
    _templateObject10 = _taggedTemplateLiteralLoose(['0% { opacity: 0; }'], ['0% { opacity: 0; }']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _ServerStyleSheet = require('../models/ServerStyleSheet');

var _ServerStyleSheet2 = _interopRequireDefault(_ServerStyleSheet);

var _utils = require('./utils');

var _injectGlobal2 = require('../constructors/injectGlobal');

var _injectGlobal3 = _interopRequireDefault(_injectGlobal2);

var _keyframes2 = require('../constructors/keyframes');

var _keyframes3 = _interopRequireDefault(_keyframes2);

var _stringifyRules = require('../utils/stringifyRules');

var _stringifyRules2 = _interopRequireDefault(_stringifyRules);

var _css = require('../constructors/css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var injectGlobal = (0, _injectGlobal3.default)(_stringifyRules2.default, _css2.default);

var index = 0;
var keyframes = (0, _keyframes3.default)(function () {
  return 'keyframe_' + index++;
}, _stringifyRules2.default, _css2.default);

var styled = void 0;

var format = function format(css) {
  return (0, _utils.stripWhitespace)(css).replace(/(\*\/|[}>])/g, "$1\n").replace(/\n\s+/g, "\n");
};

describe('ssr', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)(true);
  });

  it('should extract the CSS in a simple case', function () {
    var Heading = styled.h1(_templateObject);

    var sheet = new _ServerStyleSheet2.default();
    var html = (0, _server.renderToString)(sheet.collectStyles(_react2.default.createElement(
      Heading,
      null,
      'Hello SSR!'
    )));
    var css = format(sheet.getStyleTags());

    expect(html).toEqual('<h1 class="sc-a b" data-reactroot="" data-reactid="1" data-react-checksum="197727696">Hello SSR!</h1>');
    expect(css).toEqual(format('\n      <style type="text/css" data-styled-components="b" data-styled-components-is-local="true">\n      /* sc-component-id: sc-a */\n      .sc-a {}\n      .b { color: red; }\n      \n      </style>\n    '));
  });

  it('should extract both global and local CSS', function () {
    injectGlobal(_templateObject2);
    var Heading = styled.h1(_templateObject);

    var sheet = new _ServerStyleSheet2.default();
    var html = (0, _server.renderToString)(sheet.collectStyles(_react2.default.createElement(
      Heading,
      null,
      'Hello SSR!'
    )));
    var css = format(sheet.getStyleTags());

    expect(html).toEqual('<h1 class="sc-a b" data-reactroot="" data-reactid="1" data-react-checksum="197727696">Hello SSR!</h1>');
    expect(css).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2303210225 */\n      body { background: papayawhip; }\n      \n      </style>\n      <style type="text/css" data-styled-components="b" data-styled-components-is-local="true">\n      /* sc-component-id: sc-a */\n      .sc-a {}\n      .b { color: red; }\n      \n      </style>\n    '));
  });

  it('should render CSS in the order the components were defined, not rendered', function () {
    var ONE = styled.h1.withConfig({ componentId: 'ONE' })(_templateObject);
    var TWO = styled.h2.withConfig({ componentId: 'TWO' })(_templateObject3);

    var sheet = new _ServerStyleSheet2.default();
    var html = (0, _server.renderToString)(sheet.collectStyles(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(TWO, null),
      _react2.default.createElement(ONE, null)
    )));
    var css = format(sheet.getStyleTags());

    expect(html).toEqual('<div data-reactroot="" data-reactid="1" data-react-checksum="275982144"><h2 class="TWO a" data-reactid="2"></h2><h1 class="ONE b" data-reactid="3"></h1></div>');
    expect(css).toEqual(format('\n      <style type="text/css" data-styled-components="a b" data-styled-components-is-local="true">\n      /* sc-component-id: ONE */\n      .ONE {}\n      .b {color: red;}\n      /* sc-component-id: TWO */\n      .TWO {}\n      .a {color: blue;}\n      \n      </style>\n    '));
  });

  it('should share global styles but keep renders separate', function () {
    injectGlobal(_templateObject2);
    var PageOne = styled.h1.withConfig({ componentId: 'PageOne' })(_templateObject);
    var PageTwo = styled.h2.withConfig({ componentId: 'PageTwo' })(_templateObject3);

    var sheetOne = new _ServerStyleSheet2.default();
    var htmlOne = (0, _server.renderToString)(sheetOne.collectStyles(_react2.default.createElement(
      PageOne,
      null,
      'Camera One!'
    )));
    var cssOne = format(sheetOne.getStyleTags());

    var sheetTwo = new _ServerStyleSheet2.default();
    var htmlTwo = (0, _server.renderToString)(sheetTwo.collectStyles(_react2.default.createElement(
      PageTwo,
      null,
      'Camera Two!'
    )));
    var cssTwo = format(sheetTwo.getStyleTags());

    expect(htmlOne).toEqual('<h1 class="PageOne a" data-reactroot="" data-reactid="1" data-react-checksum="2014320521">Camera One!</h1>');
    expect(cssOne).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2303210225 */\n      body { background: papayawhip; }\n      </style>\n      <style type="text/css" data-styled-components="a" data-styled-components-is-local="true">\n      /* sc-component-id: PageOne */\n      .PageOne {}\n      .a { color: red; }\n      </style>\n    '));

    expect(htmlTwo).toEqual('<h2 class="PageTwo b" data-reactroot="" data-reactid="1" data-react-checksum="2124224444">Camera Two!</h2>');
    expect(cssTwo).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2303210225 */\n      body { background: papayawhip; }\n      </style>\n      <style type="text/css" data-styled-components="b" data-styled-components-is-local="true">\n      /* sc-component-id: PageTwo */\n      .PageTwo {}\n      .b { color: blue; }\n      </style>\n    '));
  });

  it('should allow global styles to be injected during rendering', function () {
    injectGlobal(_templateObject4);
    var PageOne = styled.h1.withConfig({ componentId: 'PageOne' })(_templateObject);
    var PageTwo = styled.h2.withConfig({ componentId: 'PageTwo' })(_templateObject3);

    var sheetOne = new _ServerStyleSheet2.default();
    var htmlOne = (0, _server.renderToString)(sheetOne.collectStyles(_react2.default.createElement(
      PageOne,
      null,
      'Camera One!'
    )));
    injectGlobal(_templateObject5);
    var cssOne = format(sheetOne.getStyleTags());

    injectGlobal(_templateObject6);

    var sheetTwo = new _ServerStyleSheet2.default();
    injectGlobal(_templateObject7);
    var htmlTwo = (0, _server.renderToString)(sheetTwo.collectStyles(_react2.default.createElement(
      PageTwo,
      null,
      'Camera Two!'
    )));
    var cssTwo = format(sheetTwo.getStyleTags());

    injectGlobal(_templateObject8);

    expect(htmlOne).toEqual('<h1 class="PageOne a" data-reactroot="" data-reactid="1" data-react-checksum="2014320521">Camera One!</h1>');
    expect(cssOne).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-737874422 */\n      html::before { content: \'Before both renders\'; }\n      </style>\n      <style type="text/css" data-styled-components="a" data-styled-components-is-local="true">\n      /* sc-component-id: PageOne */\n      .PageOne {}\n      .a { color: red; }\n      </style>\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2914197427 */\n      html::before { content: \'During first render\'; }\n      </style>\n    '));

    expect(htmlTwo).toEqual('<h2 class="PageTwo b" data-reactroot="" data-reactid="1" data-react-checksum="2124224444">Camera Two!</h2>');
    expect(cssTwo).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-737874422 */\n      html::before { content: \'Before both renders\'; }\n      </style>\n      <style type="text/css" data-styled-components="b" data-styled-components-is-local="true">\n      /* sc-component-id: PageTwo */\n      .PageTwo {}\n      .b { color: blue; }\n      </style>\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2914197427 */\n      html::before { content: \'During first render\'; }\n      /* sc-component-id: sc-global-1207956261 */\n      html::before { content: \'Between renders\'; }\n      /* sc-component-id: sc-global-3990873394 */\n      html::before { content: \'During second render\'; }\n      </style>\n    '));
  });

  it('should dispatch global styles to each ServerStyleSheet', function () {
    injectGlobal(_templateObject2);
    var Header = styled.h1.withConfig({ componentId: 'Header' })(_templateObject9, function (props) {
      return props.animation;
    });

    var sheet = new _ServerStyleSheet2.default();
    var html = (0, _server.renderToString)(sheet.collectStyles(_react2.default.createElement(Header, { animation: keyframes(_templateObject10) })));
    var css = format(sheet.getStyleTags());

    expect(html).toEqual('<h1 class="Header a" data-reactroot="" data-reactid="1" data-react-checksum="1829114759"></h1>');
    expect(css).toEqual(format('\n      <style type="text/css" data-styled-components="" data-styled-components-is-local="false">\n      /* sc-component-id: sc-global-2303210225 */\n      body { background: papayawhip; }\n      </style>\n      <style type="text/css" data-styled-components="a" data-styled-components-is-local="true">\n      /* sc-component-id: Header */\n      .Header {}\n      .a { -webkit-animation:keyframe_0 1s both; animation:keyframe_0 1s both; }\n      /* sc-component-id: sc-keyframes-keyframe_0 */\n      @-webkit-keyframes keyframe_0 {0% {opacity: 0;}}@keyframes keyframe_0 {0% {opacity: 0;}}\n      </style>\n    '));
  });
});