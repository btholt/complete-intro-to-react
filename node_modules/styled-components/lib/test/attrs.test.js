'use strict';

var _templateObject = _taggedTemplateLiteralLoose([''], ['']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      color: blue;\n      &.', ' {\n        color: red;\n      }\n    '], ['\n      color: blue;\n      &.', ' {\n        color: red;\n      }\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('attrs', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('work fine with an empty object', function () {
    var Comp = styled.div.attrs({})(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div class="sc-a b"></div>');
  });

  it('pass a simple attr', function () {
    var Comp = styled.button.attrs({
      type: 'button'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<button type="button" class="sc-a b"></button>');
  });

  it('call an attr function', function () {
    var Comp = styled.button.attrs({
      type: function type() {
        return 'button';
      }
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<button type="button" class="sc-a b"></button>');
  });

  it('pass props to the attr function', function () {
    var Comp = styled.button.attrs({
      type: function type(props) {
        return props.submit ? 'submit' : 'button';
      }
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<button type="button" class="sc-a b"></button>');
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, { submit: true })).html()).toEqual('<button type="submit" class="sc-a b"></button>');
  });

  it('should replace attrs with props', function () {
    var Comp = styled.button.attrs({
      type: function type(props) {
        return props.submit ? 'submit' : 'button';
      },
      tabIndex: 0
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<button type="button" tabindex="0" class="sc-a b"></button>');
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, { type: 'reset' })).html()).toEqual('<button type="reset" tabindex="0" class="sc-a b"></button>');
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, { type: 'reset', tabIndex: '-1' })).html()).toEqual('<button type="reset" tabindex="-1" class="sc-a b"></button>');
  });

  it('should merge className', function () {
    var Comp = styled.div.attrs({
      className: 'meow nya'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div class="sc-a meow nya b"></div>');
  });

  it('should merge className even if its a function', function () {
    var Comp = styled.div.attrs({
      className: function className(props) {
        return 'meow ' + (props.purr ? 'purr' : 'nya');
      }
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div class="sc-a meow nya b"></div>');
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, { purr: true })).html()).toEqual('<div class="sc-a meow purr b"></div>');
  });

  it('should work with data and aria attributes', function () {
    var Comp = styled.div.attrs({
      'data-foo': 'bar',
      'aria-label': 'A simple FooBar'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div data-foo="bar" aria-label="A simple FooBar" class="sc-a b"></div>');
  });

  it('merge attrs', function () {
    var Comp = styled.button.attrs({
      type: 'button',
      tabIndex: 0
    }).attrs({
      type: 'submit'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<button type="submit" tabindex="0" class="sc-a b"></button>');
  });

  it('merge attrs when inheriting SC', function () {
    var Parent = styled.button.attrs({
      type: 'button',
      tabIndex: 0
    })(_templateObject);
    var Child = Parent.extend.attrs({
      type: 'submit'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Child, null)).html()).toEqual('<button type="submit" tabindex="0" class="sc-b c"></button>');
  });

  it('pass attrs to style block', function () {
    /* Would be a React Router Link in IRL */
    var Comp = styled.a.attrs({
      href: '#',
      activeClassName: '--is-active'
    })(_templateObject2, function (props) {
      return props.activeClassName;
    });
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<a href="#" class="sc-a b"></a>');
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: blue; } .b.--is-active { color: red; }');
  });

  it('should pass through children as a normal prop', function () {
    var Comp = styled.div.attrs({
      children: 'Probably a bad idea'
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div class="sc-a b">Probably a bad idea</div>');
  });

  it('should pass through complex children as well', function () {
    var Comp = styled.div.attrs({
      children: _react2.default.createElement(
        'span',
        null,
        'Probably a bad idea'
      )
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).html()).toEqual('<div class="sc-a b"><span>Probably a bad idea</span></div>');
  });

  it('should override children of course', function () {
    var Comp = styled.div.attrs({
      children: _react2.default.createElement(
        'span',
        null,
        'Amazing'
      )
    })(_templateObject);
    expect((0, _enzyme.shallow)(_react2.default.createElement(
      Comp,
      null,
      'Something else'
    )).html()).toEqual('<div class="sc-a b">Something else</div>');
  });
});