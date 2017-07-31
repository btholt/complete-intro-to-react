'use strict';

var _templateObject = _taggedTemplateLiteralLoose([''], ['']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      color: blue;\n    '], ['\n      color: blue;\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['color: red;'], ['color: red;']),
    _templateObject4 = _taggedTemplateLiteralLoose(['color: blue;'], ['color: blue;']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('basic', function () {
  /**
   * Make sure the setup is the same for every test
   */
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should not throw an error when called', function () {
    styled.div(_templateObject);
  });

  it('should throw a meaningful error when called with null', function () {
    var invalidComps = [undefined, null, 123, []];
    invalidComps.forEach(function (comp) {
      expect(function () {
        // $FlowInvalidInputTest
        var Comp = styled(comp);
        (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
        // $FlowInvalidInputTest
      }).toThrow('Cannot create styled-component for component: ' + comp);
    });
  });

  it('should not inject anything by default', function () {
    styled.div(_templateObject);
    (0, _utils.expectCSSMatches)('');
  });

  it('should inject component class when rendered even if no styles are passed', function () {
    var Comp = styled.div(_templateObject);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {}');
  });

  it('should inject styles', function () {
    var Comp = styled.div(_templateObject2);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a { } .b { color: blue; }');
  });

  it('should inject only once for a styled component, no matter how often it\'s mounted', function () {
    var Comp = styled.div(_templateObject2);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b { color: blue; }');
  });

  it('Should have the correct styled(component) displayName', function () {
    var CompWithoutName = function CompWithoutName() {
      return function () {
        return _react2.default.createElement('div', null);
      };
    };

    var StyledTag = styled.div(_templateObject);
    expect(StyledTag.displayName).toBe('styled.div');

    var CompWithName = function CompWithName() {
      return _react2.default.createElement('div', null);
    };
    CompWithName.displayName = null;
    var StyledCompWithName = styled(CompWithName)(_templateObject);
    expect(StyledCompWithName.displayName).toBe('Styled(CompWithName)');

    var CompWithDisplayName = CompWithoutName();
    CompWithDisplayName.displayName = 'displayName';
    var StyledCompWithDisplayName = styled(CompWithDisplayName)(_templateObject);
    expect(StyledCompWithDisplayName.displayName).toBe('Styled(displayName)');

    var CompWithBoth = function CompWithBoth() {
      return _react2.default.createElement('div', null);
    };
    CompWithBoth.displayName = 'displayName';
    var StyledCompWithBoth = styled(CompWithBoth)(_templateObject);
    expect(StyledCompWithBoth.displayName).toBe('Styled(displayName)');

    var CompWithNothing = CompWithoutName();
    CompWithNothing.displayName = null;
    var StyledCompWithNothing = styled(CompWithNothing)(_templateObject);
    expect(StyledCompWithNothing.displayName).toBe('Styled(Component)');
  });

  describe('jsdom tests', function () {
    it('should pass the ref to the component', function () {
      var Comp = styled.div(_templateObject);

      var Wrapper = function (_Component) {
        _inherits(Wrapper, _Component);

        function Wrapper() {
          var _temp, _this, _ret;

          _classCallCheck(this, Wrapper);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.innerRef = function (comp) {
            _this.testRef = comp;
          }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        Wrapper.prototype.render = function render() {
          return _react2.default.createElement(Comp, { innerRef: this.innerRef });
        };

        return Wrapper;
      }(_react.Component);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Wrapper, null));
      var component = wrapper.find(Comp).first();

      // $FlowFixMe
      expect(wrapper.node.testRef).toBe(component.getDOMNode());
      expect(component.find('div').prop('innerRef')).toBeFalsy();
    });

    var InnerComponent = function (_Component2) {
      _inherits(InnerComponent, _Component2);

      function InnerComponent() {
        _classCallCheck(this, InnerComponent);

        return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
      }

      InnerComponent.prototype.render = function render() {
        return null;
      };

      return InnerComponent;
    }(_react.Component);

    it('should not leak the innerRef prop to the wrapped child', function () {
      var OuterComponent = styled(InnerComponent)(_templateObject);

      var Wrapper = function (_Component3) {
        _inherits(Wrapper, _Component3);

        function Wrapper() {
          _classCallCheck(this, Wrapper);

          return _possibleConstructorReturn(this, _Component3.apply(this, arguments));
        }

        Wrapper.prototype.render = function render() {
          var _this4 = this;

          return _react2.default.createElement(OuterComponent, { innerRef: function innerRef(comp) {
              _this4.testRef = comp;
            } });
        };

        return Wrapper;
      }(_react.Component);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Wrapper, null));
      var innerComponent = wrapper.find(InnerComponent).first();

      // $FlowFixMe
      expect(wrapper.node.testRef).toBe(innerComponent.node);
      expect(innerComponent.prop('innerRef')).toBeFalsy();
    });

    it('should pass the full className to the wrapped child', function () {
      var OuterComponent = styled(InnerComponent)(_templateObject);

      var Wrapper = function (_Component4) {
        _inherits(Wrapper, _Component4);

        function Wrapper() {
          _classCallCheck(this, Wrapper);

          return _possibleConstructorReturn(this, _Component4.apply(this, arguments));
        }

        Wrapper.prototype.render = function render() {
          return _react2.default.createElement(OuterComponent, { className: 'test' });
        };

        return Wrapper;
      }(_react.Component);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Wrapper, null));
      expect(wrapper.find(InnerComponent).prop('className')).toBe('test sc-a b');
    });

    it('should pass the innerRef to the wrapped styled component', function () {
      var InnerComponent = styled.div(_templateObject);
      var OuterComponent = styled(InnerComponent)(_templateObject);

      var Wrapper = function (_Component5) {
        _inherits(Wrapper, _Component5);

        function Wrapper() {
          var _temp2, _this6, _ret2;

          _classCallCheck(this, Wrapper);

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return _ret2 = (_temp2 = (_this6 = _possibleConstructorReturn(this, _Component5.call.apply(_Component5, [this].concat(args))), _this6), _this6.innerRef = function (comp) {
            _this6.testRef = comp;
          }, _temp2), _possibleConstructorReturn(_this6, _ret2);
        }

        Wrapper.prototype.render = function render() {
          return _react2.default.createElement(OuterComponent, { innerRef: this.innerRef });
        };

        return Wrapper;
      }(_react.Component);

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Wrapper, null));
      var innerComponent = wrapper.find(InnerComponent).first();
      var outerComponent = wrapper.find(OuterComponent).first();

      // $FlowFixMe
      expect(wrapper.node.testRef).toBe(innerComponent.getDOMNode());

      // $FlowFixMe
      expect(innerComponent.prop('innerRef')).toBe(wrapper.node.innerRef);
    });

    it('should respect the order of StyledComponent creation for CSS ordering', function () {
      var FirstComponent = styled.div(_templateObject3);
      var SecondComponent = styled.div(_templateObject4);

      // NOTE: We're mounting second before first and check if we're breaking their order
      (0, _enzyme.shallow)(_react2.default.createElement(SecondComponent, null));
      (0, _enzyme.shallow)(_react2.default.createElement(FirstComponent, null));

      (0, _utils.expectCSSMatches)('.sc-a {} .d { color: red; } .sc-b {} .c { color: blue; }');
    });
  });
});