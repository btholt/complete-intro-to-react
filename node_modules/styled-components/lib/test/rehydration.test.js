'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n        color: blue;\n      '], ['\n        color: blue;\n      ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['color: blue;'], ['color: blue;']),
    _templateObject3 = _taggedTemplateLiteralLoose([''], ['']),
    _templateObject4 = _taggedTemplateLiteralLoose(['color: red;'], ['color: red;']),
    _templateObject5 = _taggedTemplateLiteralLoose(['color: green;'], ['color: green;']),
    _templateObject6 = _taggedTemplateLiteralLoose(['\n        color: ', ';\n      '], ['\n        color: ', ';\n      ']),
    _templateObject7 = _taggedTemplateLiteralLoose(['\n        body { color: tomato; }\n      '], ['\n        body { color: tomato; }\n      ']),
    _templateObject8 = _taggedTemplateLiteralLoose(['color: tomato;'], ['color: tomato;']),
    _templateObject9 = _taggedTemplateLiteralLoose(['\n        html { font-size: 16px; }\n      '], ['\n        html { font-size: 16px; }\n      ']),
    _templateObject10 = _taggedTemplateLiteralLoose(['\n        body { background: papayawhip; }\n      '], ['\n        body { background: papayawhip; }\n      ']),
    _templateObject11 = _taggedTemplateLiteralLoose(['\n        from { opacity: 0; }\n      '], ['\n        from { opacity: 0; }\n      ']),
    _templateObject12 = _taggedTemplateLiteralLoose(['\n        from { opacity: 1; }\n      '], ['\n        from { opacity: 1; }\n      ']),
    _templateObject13 = _taggedTemplateLiteralLoose(['animation: ', ' 1s both;'], ['animation: ', ' 1s both;']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

var _injectGlobal2 = require('../constructors/injectGlobal');

var _injectGlobal3 = _interopRequireDefault(_injectGlobal2);

var _stringifyRules = require('../utils/stringifyRules');

var _stringifyRules2 = _interopRequireDefault(_stringifyRules);

var _css = require('../constructors/css');

var _css2 = _interopRequireDefault(_css);

var _keyframes2 = require('../constructors/keyframes');

var _keyframes3 = _interopRequireDefault(_keyframes2);

var _StyleSheet = require('../models/StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var keyframes = (0, _keyframes3.default)(function (hash) {
  return 'keyframe_' + hash % 1000;
}, _stringifyRules2.default, _css2.default);
var injectGlobal = (0, _injectGlobal3.default)(_stringifyRules2.default, _css2.default);

var getStyleTags = function getStyleTags() {
  return Array.from(document.querySelectorAll('style')).map(function (el) {
    return {
      isLocal: el.getAttribute('data-styled-components-is-local'),
      css: el.innerHTML.trim().replace(/\s+/mg, ' ')
    };
  });
};

var styled = void 0;

describe('rehydration', function () {
  /**
   * Make sure the setup is the same for every test
   */
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  describe('with existing styled components', function () {
    beforeEach(function () {
      /* Hash 1323611362 is based on name TWO and contents color: red.
       * Change either and this will break. */
      document.head.innerHTML = '\n        <style ' + _StyleSheet.SC_ATTR + '=\'b\' ' + _StyleSheet.LOCAL_ATTR + '=\'true\'>\n          /* sc-component-id: TWO */\n          .TWO {}\n          .b { color: red; }\n        </style>\n      ';
      _StyleSheet2.default.reset();
    });

    it('should preserve the styles', function () {
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; }');
    });

    it('should append a new component like normal', function () {
      var Comp = styled.div.withConfig({ componentId: 'ONE' })(_templateObject);
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; } .ONE { } .a { color: blue; }');
    });

    it('should reuse a componentId', function () {
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject3);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; } .ONE { } .a { color: blue; }');
    });

    it('should reuse a componentId and generated class', function () {
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; } .ONE { } .a { color: blue; }');
    });

    it('should reuse a componentId and inject new classes', function () {
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      var C = styled.div.withConfig({ componentId: 'TWO' })(_templateObject5);
      (0, _enzyme.shallow)(_react2.default.createElement(C, null));
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; } .c { color: green; } .ONE { } .a { color: blue; }');
    });
  });

  describe('with styled components with props', function () {
    beforeEach(function () {
      /* Hash 1323611362 is based on name TWO and contents color: red.
       * Change either and this will break. */
      document.head.innerHTML = '\n        <style ' + _StyleSheet.SC_ATTR + '=\'a b\' ' + _StyleSheet.LOCAL_ATTR + '=\'true\'>\n          /* sc-component-id: ONE */\n          .ONE {}\n          .a { color: blue; }\n          /* sc-component-id: TWO */\n          .TWO {}\n          .b { color: red; }\n        </style>\n      ';
      _StyleSheet2.default.reset();
    });

    it('should preserve the styles', function () {
      (0, _utils.expectCSSMatches)('\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; }\n      ');
    });

    it('should not inject new styles for a component already rendered', function () {
      var Comp = styled.div.withConfig({ componentId: 'ONE' })(_templateObject6, function (props) {
        return props.color;
      });
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, { color: 'blue' }));
      (0, _utils.expectCSSMatches)('\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; }\n      ');
    });

    it('should inject new styles for a new computed style of a component', function () {
      (0, _utils.seedNextClassnames)(['x']);
      var Comp = styled.div.withConfig({ componentId: 'ONE' })(_templateObject6, function (props) {
        return props.color;
      });
      (0, _enzyme.shallow)(_react2.default.createElement(Comp, { color: 'green' }));
      (0, _utils.expectCSSMatches)('\n        .ONE { } .a { color: blue; } .x { color: green; }\n        .TWO { } .b { color: red; }\n      ');
    });
  });

  describe('with inline styles that werent rendered by us', function () {
    beforeEach(function () {
      /* Same css as before, but without the data attributes we ignore it */
      document.head.innerHTML = '\n        <style>\n          /* sc-component-id: TWO */\n          .TWO {}\n          .b { color: red; }\n        </style>\n      ';
      _StyleSheet2.default.reset();
    });

    it('should leave the existing styles there', function () {
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; }');
    });

    it('should generate new classes, even if they have the same name', function () {
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      (0, _utils.expectCSSMatches)('.TWO {} .b { color: red; } .ONE { } .a { color: blue; } .TWO {} .b { color: red; } ');
    });
  });

  describe('with global styles', function () {
    beforeEach(function () {
      /* Adding a non-local stylesheet with a hash 557410406 which is
       * derived from "body { background: papayawhip; }" so be careful
       * changing it. */
      document.head.innerHTML = '\n        <style ' + _StyleSheet.SC_ATTR + ' ' + _StyleSheet.LOCAL_ATTR + '=\'false\'>\n          /* sc-component-id: sc-global-557410406 */\n          body { background: papayawhip; }\n        </style>\n        <style ' + _StyleSheet.SC_ATTR + '=\'b\' ' + _StyleSheet.LOCAL_ATTR + '=\'true\'>\n          /* sc-component-id: TWO */\n          .TWO {}\n          .b { color: red; }\n        </style>\n      ';
      _StyleSheet2.default.reset();
    });

    it('should leave the existing styles there', function () {
      (0, _utils.expectCSSMatches)('body { background: papayawhip; } .TWO {} .b { color: red; }');
    });

    it('should inject new global styles at the end', function () {
      injectGlobal(_templateObject7);
      (0, _utils.expectCSSMatches)('body { background: papayawhip; } .TWO {} .b { color: red; } body { color: tomato; }');

      expect(getStyleTags()).toEqual([{ isLocal: 'false', css: '/* sc-component-id: sc-global-557410406 */ body { background: papayawhip; }' }, { isLocal: 'true', css: '/* sc-component-id: TWO */ .TWO {} .b { color: red; }' }, { isLocal: 'false', css: '/* sc-component-id: sc-global-2299393384 */ body {color: tomato;}' }]);
    });

    it('should interleave global and local styles', function () {
      injectGlobal(_templateObject7);
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));

      (0, _utils.expectCSSMatches)('body { background: papayawhip; } .TWO {} .b { color: red; } body { color: tomato; } .ONE { } .a { color: blue; }');
      expect(getStyleTags()).toEqual([{ isLocal: 'false', css: '/* sc-component-id: sc-global-557410406 */ body { background: papayawhip; }' }, { isLocal: 'true', css: '/* sc-component-id: TWO */ .TWO {} .b { color: red; }' }, { isLocal: 'false', css: '/* sc-component-id: sc-global-2299393384 */ body {color: tomato;}' }, { isLocal: 'true', css: '/* sc-component-id: ONE */ .ONE {} .a {color: blue;}' }]);
    });
  });

  describe('with all styles already rendered', function () {
    var styleTags = void 0;
    beforeEach(function () {
      document.head.innerHTML = '\n        <style ' + _StyleSheet.SC_ATTR + ' ' + _StyleSheet.LOCAL_ATTR + '=\'false\'>\n           /* sc-component-id: sc-global-1455077013 */\n          html { font-size: 16px; }\n           /* sc-component-id: sc-global-557410406 */\n          body { background: papayawhip; }\n        </style>\n        <style ' + _StyleSheet.SC_ATTR + '=\'a b\' ' + _StyleSheet.LOCAL_ATTR + '=\'true\'>\n          /* sc-component-id: ONE */\n          .ONE {}\n          .a { color: blue; }\n          /* sc-component-id: TWO */\n          .TWO {}\n          .b { color: red; }\n        </style>\n      ';
      styleTags = Array.from(document.querySelectorAll('style'));
      _StyleSheet2.default.reset();
    });

    it('should not touch existing styles', function () {
      (0, _utils.expectCSSMatches)('\n        html { font-size: 16px; }\n        body { background: papayawhip; }\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; }\n      ');
    });

    it('should replace stylesheets on-demand', function () {
      var tagsAfterReset = Array.from(document.querySelectorAll('style'));
      expect(tagsAfterReset[0]).toBe(styleTags[0]);
      expect(tagsAfterReset[1]).toBe(styleTags[1]);

      /* Rerendering existing tags doesn't touch the DOM */
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      var styleTagsAfterRehydration = Array.from(document.querySelectorAll('style'));
      expect(styleTagsAfterRehydration[0]).toBe(styleTags[0]);
      expect(styleTagsAfterRehydration[1]).toBe(styleTags[1]);

      /* Only when new components are introduced (or a previous component
       * generates a new hash) does the style tag get replaced. */
      var C = styled.div.withConfig({ componentId: 'THREE' })(_templateObject5);
      (0, _enzyme.shallow)(_react2.default.createElement(C, null));
      var styleTagsAfterAddition = Array.from(document.querySelectorAll('style'));

      /* The first tag is unchanged */
      expect(styleTagsAfterAddition[0]).toBe(styleTags[0]);
      /* The local tag has been replaced */
      expect(styleTagsAfterAddition[1]).not.toBe(styleTags[1]);
      /* But it is identical, except for... */
      expect(styleTagsAfterAddition[1].outerHTML).toEqual(styleTags[1].outerHTML
      /* ...the new data attribute for the new classname "c"... */
      .replace(new RegExp(_StyleSheet.SC_ATTR + '="a b"'), _StyleSheet.SC_ATTR + '="a b c"')
      /* ...and the new CSS before the closing tag.  */
      .replace(/(?=<\/style>)/, '\n/* sc-component-id: THREE */\n.THREE {}\n.c {color: green;}'));

      /* Note: any future additions don't replace the style tag */
      var D = styled.div.withConfig({ componentId: 'TWO' })(_templateObject8);
      (0, _enzyme.shallow)(_react2.default.createElement(D, null));

      expect(Array.from(document.querySelectorAll('style'))[1]).toBe(styleTagsAfterAddition[1]);

      /* The point being, now we have a style tag we can inject new styles in the middle! */
      (0, _utils.expectCSSMatches)('\n        html { font-size: 16px; }\n        body { background: papayawhip; }\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; } .d { color: tomato; }\n        .THREE { } .c { color: green; }\n      ');
    });

    it('should not change styles if rendered in the same order they were created with', function () {
      injectGlobal(_templateObject9);
      injectGlobal(_templateObject10);
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));

      (0, _utils.expectCSSMatches)('\n        html { font-size: 16px; }\n        body { background: papayawhip; }\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; }\n      ');
    });

    it('should still not change styles if rendered in a different order', function () {
      var B = styled.div.withConfig({ componentId: 'TWO' })(_templateObject4);
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      injectGlobal(_templateObject10);
      var A = styled.div.withConfig({ componentId: 'ONE' })(_templateObject2);
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));
      injectGlobal(_templateObject9);

      (0, _utils.expectCSSMatches)('\n        html { font-size: 16px; }\n        body { background: papayawhip; }\n        .ONE { } .a { color: blue; }\n        .TWO { } .b { color: red; }\n      ');
    });
  });

  describe('with keyframes', function () {
    beforeEach(function () {
      document.head.innerHTML = '\n        <style ' + _StyleSheet.SC_ATTR + '=\'keyframe_880\' ' + _StyleSheet.LOCAL_ATTR + '=\'false\'>\n          /* sc-component-id: sc-keyframes-keyframe_880 */\n          @-webkit-keyframes keyframe_880 {from {opacity: 0;}}@keyframes keyframe_880 {from {opacity: 0;}}\n        </style>\n      ';
      _StyleSheet2.default.reset();
    });

    it('should not touch existing styles', function () {
      (0, _utils.expectCSSMatches)('\n        @-webkit-keyframes keyframe_880 {from {opacity: 0;}}@keyframes keyframe_880 {from {opacity: 0;}}\n      ');
    });

    it('should not regenerate keyframes', function () {
      keyframes(_templateObject11);
      (0, _utils.expectCSSMatches)('\n        @-webkit-keyframes keyframe_880 {from {opacity: 0;}}@keyframes keyframe_880 {from {opacity: 0;}}\n      ');
    });

    it('should still inject new keyframes', function () {
      keyframes(_templateObject12);
      (0, _utils.expectCSSMatches)('\n        @-webkit-keyframes keyframe_880 {from {opacity: 0;}}@keyframes keyframe_880 {from {opacity: 0;}}\n        @-webkit-keyframes keyframe_144 {from {opacity: 1;}}@keyframes keyframe_144 {from {opacity: 1;}}\n      ');
    });

    it('should pass the keyframes name along as well', function () {
      var fadeIn = keyframes(_templateObject11);
      var A = styled.div(_templateObject13, fadeIn);
      var fadeOut = keyframes(_templateObject12);
      var B = styled.div(_templateObject13, fadeOut);
      /* Purposely rendering out of order to make sure the output looks right */
      (0, _enzyme.shallow)(_react2.default.createElement(B, null));
      (0, _enzyme.shallow)(_react2.default.createElement(A, null));

      (0, _utils.expectCSSMatches)('\n        @-webkit-keyframes keyframe_880 {from {opacity: 0;}}@keyframes keyframe_880 {from {opacity: 0;}}\n        .sc-a { } .d { -webkit-animation:keyframe_880 1s both; animation:keyframe_880 1s both; }\n        @-webkit-keyframes keyframe_144 {from {opacity: 1;}}@keyframes keyframe_144 {from {opacity: 1;}}\n        .sc-b { } .c { -webkit-animation:keyframe_144 1s both; animation:keyframe_144 1s both; }\n      ');
    });
  });
});