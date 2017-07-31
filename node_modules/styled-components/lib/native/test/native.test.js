'use strict';

var _templateObject = _taggedTemplateLiteralLoose([''], ['']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n      padding-top: 10;\n    '], ['\n      padding-top: 10;\n    ']),
    _templateObject3 = _taggedTemplateLiteralLoose(['opacity: 0.9;'], ['opacity: 0.9;']),
    _templateObject4 = _taggedTemplateLiteralLoose(['padding: 10px;'], ['padding: 10px;']);

require('react-native');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _enzyme = require('enzyme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

// NOTE: These tests are like the ones for Web but a "light-version" of them
// This is mostly due to the similar logic

describe('native', function () {
  it('should not throw an error when called', function () {
    _index2.default.View(_templateObject);
  });

  it('should generate inline styles', function () {
    var Comp = _index2.default.View(_templateObject);
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    var view = wrapper.find('View').first();

    expect(view.prop('style')).toEqual([{}, undefined]);
  });

  it('should combine inline styles and the style prop', function () {
    var Comp = _index2.default.View(_templateObject2);

    var style = { opacity: 0.9 };
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, { style: style }));
    var view = wrapper.find('View').first();

    expect(view.prop('style')).toEqual([{ paddingTop: 10 }, style]);
  });

  describe('extending', function () {
    it('should combine styles of extending components', function () {
      var Parent = _index2.default.View(_templateObject3);
      var Child = Parent.extend(_templateObject4);

      var parent = (0, _enzyme.shallow)(_react2.default.createElement(Parent, null));
      var child = (0, _enzyme.shallow)(_react2.default.createElement(Child, null));

      expect(parent.find('View').prop('style')).toEqual([{ opacity: 0.9 }, undefined]);

      expect(child.find('View').prop('style')).toEqual([{
        opacity: 0.9,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10
      }, undefined]);
    });
  });

  describe('attrs', function () {
    it('works fine with an empty object', function () {
      var Comp = _index2.default.View.attrs({})(_templateObject);
      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
      var view = wrapper.find('View').first();

      expect(view.props()).toEqual({
        style: [{}, undefined]
      });
    });

    it('passes simple props on', function () {
      var Comp = _index2.default.View.attrs({
        test: true
      })(_templateObject);

      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
      var view = wrapper.find('View').first();

      expect(view.props()).toEqual({
        style: [{}, undefined],
        test: true
      });
    });

    it('calls an attr-function with context', function () {
      var Comp = _index2.default.View.attrs({
        copy: function copy(props) {
          return props.test;
        }
      })(_templateObject);

      var test = 'Put that cookie down!';
      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, { test: test }));
      var view = wrapper.find('View').first();

      expect(view.props()).toEqual({
        style: [{}, undefined],
        copy: test,
        test: test
      });
    });

    it('merges multiple calls', function () {
      var Comp = _index2.default.View.attrs({
        first: 'first',
        test: '_'
      }).attrs({
        second: 'second',
        test: 'test'
      })(_templateObject);

      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
      var view = wrapper.find('View').first();

      expect(view.props()).toEqual({
        style: [{}, undefined],
        first: 'first',
        second: 'second',
        test: 'test'
      });
    });

    it('merges attrs when inheriting SC', function () {
      var Parent = _index2.default.View.attrs({
        first: 'first'
      })(_templateObject);

      var Child = Parent.extend.attrs({
        second: 'second'
      })(_templateObject);

      var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(Child, null));
      var view = wrapper.find('View').first();

      expect(view.props()).toEqual({
        style: [{}, undefined],
        first: 'first',
        second: 'second'
      });
    });
  });

  describe('expanded API', function () {
    it('should attach a displayName', function () {
      var Comp = _index2.default.View(_templateObject);
      expect(Comp.displayName).toBe('Styled(View)');

      var CompTwo = _index2.default.View.withConfig({ displayName: 'Test' })(_templateObject);
      expect(CompTwo.displayName).toBe('Test');
    });

    it('should allow multiple calls to be chained', function () {
      var Comp = _index2.default.View.withConfig({ displayName: 'Test1' }).withConfig({ displayName: 'Test2' })(_templateObject);

      expect(Comp.displayName).toBe('Test2');
    });
  });

  describe('innerRef', function () {
    it('should pass the ref to the component', function () {
      var Comp = _index2.default.View(_templateObject);
      var ref = jest.fn();

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(Comp, { innerRef: ref }));
      var view = wrapper.find('View').first();
      var comp = wrapper.find(Comp).first();

      // $FlowFixMe
      expect(ref).toHaveBeenCalledWith(view.node);
      expect(view.prop('innerRef')).toBeFalsy();
      expect(comp.node.root).toBeTruthy();
    });

    var InnerComponent = function (_React$Component) {
      _inherits(InnerComponent, _React$Component);

      function InnerComponent() {
        _classCallCheck(this, InnerComponent);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      InnerComponent.prototype.render = function render() {
        return null;
      };

      return InnerComponent;
    }(_react2.default.Component);

    it('should not leak the innerRef prop to the wrapped child', function () {
      var OuterComponent = (0, _index2.default)(InnerComponent)(_templateObject);
      var ref = jest.fn();

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(OuterComponent, { innerRef: ref }));
      var innerComponent = wrapper.find(InnerComponent).first();
      var outerComponent = wrapper.find(OuterComponent).first();

      // $FlowFixMe
      expect(ref).toHaveBeenCalledWith(innerComponent.node);
      expect(innerComponent.prop('innerRef')).toBeFalsy();
      expect(outerComponent.node.root).toBeTruthy();
    });

    it('should pass the innerRef to the wrapped styled component', function () {
      var InnerComponent = _index2.default.View(_templateObject);
      var OuterComponent = (0, _index2.default)(InnerComponent)(_templateObject);
      var ref = jest.fn();

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(OuterComponent, { innerRef: ref }));
      var view = wrapper.find('View').first();
      var innerComponent = wrapper.find(InnerComponent).first();
      var outerComponent = wrapper.find(OuterComponent).first();

      // $FlowFixMe
      expect(ref).toHaveBeenCalledWith(view.node);
      expect(outerComponent.node.root).toBeTruthy();
    });

    it('should pass innerRef instead of ref to a wrapped stateless functional component', function () {
      var InnerComponent = function InnerComponent() {
        return null;
      };
      var OuterComponent = (0, _index2.default)(InnerComponent)(_templateObject);
      // NOTE: A ref should always be passed, so we don't need to (setNativeProps feature)

      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(OuterComponent, null));
      var outerComponent = wrapper.find(OuterComponent).first();
      var innerComponent = wrapper.find(InnerComponent).first();

      expect(innerComponent.prop('ref')).toBeFalsy();
      expect(innerComponent.prop('innerRef')).toBeTruthy();
      expect(outerComponent.node.root).toBeFalsy();
    });
  });
});