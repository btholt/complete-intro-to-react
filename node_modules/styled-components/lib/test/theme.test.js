'use strict';

var _templateObject = _taggedTemplateLiteralLoose(['\n      color: ', ';\n    '], ['\n      color: ', ';\n    ']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      background: ', ';\n    '], ['\n      background: ', ';\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['\n      color: ', ';\n      z-index: ', 'px;\n    '], ['\n      color: ', ';\n      z-index: ', 'px;\n    ']),
    _templateObject4 = _taggedTemplateLiteralLoose([''], ['']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

var _ThemeProvider = require('../models/ThemeProvider');

var _ThemeProvider2 = _interopRequireDefault(_ThemeProvider);

var _withTheme = require('../hoc/withTheme');

var _withTheme2 = _interopRequireDefault(_withTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('theming', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should inject props.theme into a styled component', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(Comp, null)
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ' + theme.color + '; }');
  });

  it('should inject props.theme into a styled component multiple levels deep', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp, null)
        )
      )
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ' + theme.color + '; }');
  });

  it('should properly allow a component to fallback to its default props when a theme is not provided', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.test.color;
    });

    Comp1.defaultProps = {
      theme: {
        test: {
          color: "purple"
        }
      }
    };
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Comp1, null)
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; }');
  });

  // https://github.com/styled-components/styled-components/issues/344
  it('should use ThemeProvider theme instead of defaultProps theme', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.test.color;
    });

    Comp1.defaultProps = {
      theme: {
        test: {
          color: "purple"
        }
      }
    };
    var theme = { test: { color: 'green' } };

    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(Comp1, null)
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: green; }');
  });

  it('should properly allow a component to override the theme with a prop even if it is equal to defaultProps theme', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.test.color;
    });

    Comp1.defaultProps = {
      theme: {
        test: {
          color: "purple"
        }
      }
    };
    var theme = { test: { color: 'green' } };

    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(Comp1, { theme: { test: { color: 'purple' } } })
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; }');
  });

  it('should properly allow a component to override the theme with a prop', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    var theme = {
      color: 'purple'
    };

    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(Comp, { theme: { color: 'red' } })
      )
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: red; }');
  });

  it('should properly set the theme with an empty object when no theme is provided and no defaults are set', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Comp1, null)
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ; }');
  });

  it('should only inject props.theme into styled components within its child component tree', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var Comp2 = styled.div(_templateObject2, function (props) {
      return props.theme.color;
    });

    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp1, null)
        )
      ),
      _react2.default.createElement(Comp2, null)
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .c { color: ' + theme.color + '; } .sc-b {} .d { background: ; }');
  });

  it('should inject props.theme into all styled components within the child component tree', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var Comp2 = styled.div(_templateObject2, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp1, null)
        ),
        _react2.default.createElement(Comp2, null)
      )
    ));
    (0, _utils.expectCSSMatches)('.sc-a {} .c { color: ' + theme.color + '; } .sc-b {} .d { background: ' + theme.color + '; }');
  });

  it('should inject new CSS when the theme changes', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var originalTheme = { color: 'black' };
    var newTheme = { color: 'blue' };
    var theme = originalTheme;
    // Force render the component
    var renderComp = function renderComp() {
      (0, _enzyme.render)(_react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(Comp, null)
      ));
    };
    renderComp();
    var initialCSS = (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ' + theme.color + '; }');
    // Change the theme
    theme = newTheme;
    renderComp();
    (0, _utils.expectCSSMatches)(initialCSS + ' .c { color: ' + newTheme.color + '; }');
  });
});

describe('theming', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should properly render with the same theme from default props on re-render', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    Comp1.defaultProps = {
      theme: {
        color: "purple"
      }
    };
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Comp1, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; }');

    wrapper.update();
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; }');
  });

  it('should properly update style if theme is changed', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    Comp1.defaultProps = {
      theme: {
        color: "purple"
      }
    };
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Comp1, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; }');

    wrapper.setProps({ theme: { color: 'pink' } });
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: purple; } .c { color: pink; }');
  });

  it('should properly update style if props used in styles is changed', function () {
    var Comp1 = styled.div(_templateObject3, function (props) {
      return props.theme.color;
    }, function (props) {
      return props.zIndex;
    });

    Comp1.defaultProps = {
      theme: {
        color: "purple"
      },
      zIndex: 0
    };
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Comp1, null));
    var expectedStyles = '.sc-a {} .b { color: purple; z-index: 0px; }';
    (0, _utils.expectCSSMatches)(expectedStyles);

    wrapper.setProps({ theme: { color: 'pink' } });
    expectedStyles = expectedStyles + ' .c { color: pink; z-index: 0px; }';
    (0, _utils.expectCSSMatches)(expectedStyles);

    wrapper.setProps({ zIndex: 1 });
    (0, _utils.expectCSSMatches)(expectedStyles + ' .d { color: pink; z-index: 1px; }');
  });

  it('should change the classnames when the theme changes', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    var originalTheme = { color: 'black' };
    var newTheme = { color: 'blue' };

    var Theme = function Theme(_ref) {
      var theme = _ref.theme;
      return _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(Comp, { someProps: theme })
      );
    };

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Theme, { theme: originalTheme }));

    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ' + originalTheme.color + '; }');
    expect(wrapper.find('div').prop('className')).toBe('sc-a b');

    // Change theme
    wrapper.setProps({ theme: newTheme });

    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: ' + originalTheme.color + '; } .c { color: ' + newTheme.color + '; }');
    expect(wrapper.find('div').prop('className')).toBe('sc-a c');
  });

  it('should inject props.theme into a component that uses withTheme hoc', function () {
    var originalTheme = { color: 'black' };

    var MyDiv = function MyDiv(_ref2) {
      var theme = _ref2.theme;
      return _react2.default.createElement(
        'div',
        null,
        theme.color
      );
    };
    var MyDivWithTheme = (0, _withTheme2.default)(MyDiv);

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: originalTheme },
      _react2.default.createElement(MyDivWithTheme, null)
    ));

    expect(wrapper.find('div').text()).toBe('black');
  });

  it('should properly update theme prop on hoc component when theme is changed', function () {
    var MyDiv = function MyDiv(_ref3) {
      var theme = _ref3.theme;
      return _react2.default.createElement(
        'div',
        null,
        theme.color
      );
    };
    var MyDivWithTheme = (0, _withTheme2.default)(MyDiv);

    var originalTheme = { color: 'black' };
    var newTheme = { color: 'blue' };

    var Theme = function Theme(_ref4) {
      var theme = _ref4.theme;
      return _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(MyDivWithTheme, null)
      );
    };

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Theme, { theme: originalTheme }));

    expect(wrapper.find('div').text()).toBe('black');

    // Change theme
    wrapper.setProps({ theme: newTheme });

    expect(wrapper.find('div').text()).toBe('blue');
  });

  // https://github.com/styled-components/styled-components/issues/445
  it('should use ThemeProvider theme instead of defaultProps theme after initial render', function () {
    var Text = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    Text.defaultProps = {
      theme: {
        color: 'purple'
      }
    };

    var Theme = function Theme(_ref5) {
      var props = _ref5.props;
      return _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: { color: 'green' } },
        _react2.default.createElement(Text, props)
      );
    };

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Theme, { prop: 'foo' }));

    (0, _utils.expectCSSMatches)('.sc-a { } .b { color: green; } ');

    wrapper.setProps({ prop: 'bar' });

    (0, _utils.expectCSSMatches)('.sc-a { } .b { color: green; } ');
  });

  // https://github.com/styled-components/styled-components/issues/596
  it('should hoist static properties when using withTheme', function () {
    var MyComponent = function (_React$Component) {
      _inherits(MyComponent, _React$Component);

      function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      return MyComponent;
    }(_react2.default.Component);

    MyComponent.myStaticProperty = true;


    var MyComponentWithTheme = (0, _withTheme2.default)(MyComponent);

    expect(MyComponentWithTheme.myStaticProperty).toBe(true);
  });

  it('should accept innerRef and pass it on as ref', function () {
    var Comp = function (_React$Component2) {
      _inherits(Comp, _React$Component2);

      function Comp() {
        _classCallCheck(this, Comp);

        return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
      }

      Comp.prototype.render = function render() {
        return _react2.default.createElement('div', null);
      };

      return Comp;
    }(_react2.default.Component);

    var CompWithTheme = (0, _withTheme2.default)(Comp);
    var ref = jest.fn();

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: {} },
      _react2.default.createElement(CompWithTheme, { innerRef: ref })
    ));

    var inner = wrapper.find(Comp).first();

    // $FlowFixMe
    expect(ref).toHaveBeenCalledWith(inner.node);
    expect(inner.prop('innerRef')).toBe(undefined);
  });

  it('should accept innerRef and pass it on for styled components', function () {
    var Comp = styled.div(_templateObject4);
    var CompWithTheme = (0, _withTheme2.default)(Comp);
    var ref = jest.fn();

    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: {} },
      _react2.default.createElement(CompWithTheme, { innerRef: ref })
    ));

    var inner = wrapper.find(Comp).first();

    // $FlowFixMe
    expect(ref).toHaveBeenCalledWith(inner.getDOMNode());
    expect(inner.prop('innerRef')).toBe(ref);
  });
});