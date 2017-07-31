'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _isTag = require('../utils/isTag');

var _isTag2 = _interopRequireDefault(_isTag);

var _isStyledComponent = require('../utils/isStyledComponent');

var _isStyledComponent2 = _interopRequireDefault(_isStyledComponent);

var _getComponentName = require('../utils/getComponentName');

var _getComponentName2 = _interopRequireDefault(_getComponentName);

var _ThemeProvider = require('./ThemeProvider');

var _InlineStyle = require('./InlineStyle');

var _InlineStyle2 = _interopRequireDefault(_InlineStyle);

var _AbstractStyledComponent = require('./AbstractStyledComponent');

var _AbstractStyledComponent2 = _interopRequireDefault(_AbstractStyledComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var babelPluginFlowReactPropTypes_proptype_Theme = require('./ThemeProvider').babelPluginFlowReactPropTypes_proptype_Theme || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_Target = require('../types').babelPluginFlowReactPropTypes_proptype_Target || require('prop-types').any;

var babelPluginFlowReactPropTypes_proptype_RuleSet = require('../types').babelPluginFlowReactPropTypes_proptype_RuleSet || require('prop-types').any;

exports.default = function (constructWithOptions) {
  var BaseStyledNativeComponent = function (_AbstractStyledCompon) {
    _inherits(BaseStyledNativeComponent, _AbstractStyledCompon);

    function BaseStyledNativeComponent() {
      var _temp, _this, _ret;

      _classCallCheck(this, BaseStyledNativeComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _AbstractStyledCompon.call.apply(_AbstractStyledCompon, [this].concat(args))), _this), _this.attrs = {}, _this.state = {
        theme: null,
        generatedStyles: undefined
      }, _this.onRef = function (node) {
        var innerRef = _this.props.innerRef;

        _this.root = node;

        if (typeof innerRef === 'function') {
          innerRef(node);
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    BaseStyledNativeComponent.prototype.buildExecutionContext = function buildExecutionContext(theme, props) {
      var attrs = this.constructor.attrs;

      var context = _extends({}, props, { theme: theme });
      if (attrs === undefined) {
        return context;
      }

      this.attrs = Object.keys(attrs).reduce(function (acc, key) {
        var attr = attrs[key];
        // eslint-disable-next-line no-param-reassign
        acc[key] = typeof attr === 'function' ? attr(context) : attr;
        return acc;
      }, {});

      return _extends({}, context, this.attrs);
    };

    BaseStyledNativeComponent.prototype.generateAndInjectStyles = function generateAndInjectStyles(theme, props) {
      var inlineStyle = this.constructor.inlineStyle;

      var executionContext = this.buildExecutionContext(theme, props);

      return inlineStyle.generateStyleObject(executionContext);
    };

    BaseStyledNativeComponent.prototype.componentWillMount = function componentWillMount() {
      var _this2 = this;

      // If there is a theme in the context, subscribe to the event emitter. This
      // is necessary due to pure components blocking context updates, this circumvents
      // that by updating when an event is emitted
      if (this.context[_ThemeProvider.CHANNEL]) {
        var subscribe = this.context[_ThemeProvider.CHANNEL];
        this.unsubscribe = subscribe(function (nextTheme) {
          // This will be called once immediately

          // Props should take precedence over ThemeProvider, which should take precedence over
          // defaultProps, but React automatically puts defaultProps on props.
          var defaultProps = _this2.constructor.defaultProps;

          var isDefaultTheme = defaultProps && _this2.props.theme === defaultProps.theme;
          var theme = _this2.props.theme && !isDefaultTheme ? _this2.props.theme : nextTheme;
          var generatedStyles = _this2.generateAndInjectStyles(theme, _this2.props);
          _this2.setState({ theme: theme, generatedStyles: generatedStyles });
        });
      } else {
        var _theme = this.props.theme || {};
        var generatedStyles = this.generateAndInjectStyles(_theme, this.props);
        this.setState({ theme: _theme, generatedStyles: generatedStyles });
      }
    };

    BaseStyledNativeComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      this.setState(function (oldState) {
        // Props should take precedence over ThemeProvider, which should take precedence over
        // defaultProps, but React automatically puts defaultProps on props.
        var defaultProps = _this3.constructor.defaultProps;

        var isDefaultTheme = defaultProps && nextProps.theme === defaultProps.theme;
        var theme = nextProps.theme && !isDefaultTheme ? nextProps.theme : oldState.theme;
        var generatedStyles = _this3.generateAndInjectStyles(theme, nextProps);

        return { theme: theme, generatedStyles: generatedStyles };
      });
    };

    BaseStyledNativeComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    };

    BaseStyledNativeComponent.prototype.setNativeProps = function setNativeProps(nativeProps) {
      if (this.root !== undefined) {
        // $FlowFixMe
        this.root.setNativeProps(nativeProps);
      } else {
        var displayName = this.constructor.displayName;

        // eslint-disable-next-line no-console

        console.warn('setNativeProps was called on a Styled Component wrapping a stateless functional component. ' + 'In this case no ref will be stored, and instead an innerRef prop will be passed on.\n' + ('Check whether the stateless functional component is passing on innerRef as a ref in ' + displayName + '.'));
      }
    };

    BaseStyledNativeComponent.prototype.render = function render() {
      var _props = this.props,
          children = _props.children,
          style = _props.style;
      var generatedStyles = this.state.generatedStyles;
      var target = this.constructor.target;


      var propsForElement = _extends({}, this.attrs, this.props, {
        style: [generatedStyles, style]
      });

      if (!(0, _isStyledComponent2.default)(target) && (
      // NOTE: We can't pass a ref to a stateless functional component
      typeof target !== 'function' || target.prototype && 'isReactComponent' in target.prototype)) {
        propsForElement.ref = this.onRef;
        delete propsForElement.innerRef;
      } else {
        propsForElement.innerRef = this.onRef;
      }

      return (0, _react.createElement)(target, propsForElement, children);
    };

    return BaseStyledNativeComponent;
  }(_AbstractStyledComponent2.default);

  var createStyledNativeComponent = function createStyledNativeComponent(target, options, rules) {
    var _options$displayName = options.displayName,
        displayName = _options$displayName === undefined ? (0, _isTag2.default)(target) ? 'styled.' + target : 'Styled(' + (0, _getComponentName2.default)(target) + ')' : _options$displayName,
        _options$ParentCompon = options.ParentComponent,
        ParentComponent = _options$ParentCompon === undefined ? BaseStyledNativeComponent : _options$ParentCompon,
        extendingRules = options.rules,
        attrs = options.attrs;


    var inlineStyle = new _InlineStyle2.default(extendingRules === undefined ? rules : extendingRules.concat(rules));

    var StyledNativeComponent = function (_ParentComponent) {
      _inherits(StyledNativeComponent, _ParentComponent);

      function StyledNativeComponent() {
        _classCallCheck(this, StyledNativeComponent);

        return _possibleConstructorReturn(this, _ParentComponent.apply(this, arguments));
      }

      StyledNativeComponent.withComponent = function withComponent(tag) {
        var _ = options.displayName,
            __ = options.componentId,
            optionsToCopy = _objectWithoutProperties(options, ['displayName', 'componentId']);

        var newOptions = _extends({}, optionsToCopy, { ParentComponent: StyledNativeComponent });
        return createStyledNativeComponent(tag, newOptions, rules);
      };

      // NOTE: This is so that isStyledComponent passes for the innerRef unwrapping


      _createClass(StyledNativeComponent, null, [{
        key: 'extend',
        get: function get() {
          var _ = options.displayName,
              __ = options.componentId,
              optionsToCopy = _objectWithoutProperties(options, ['displayName', 'componentId']);

          var newOptions = _extends({}, optionsToCopy, { rules: rules, ParentComponent: StyledNativeComponent });
          return constructWithOptions(createStyledNativeComponent, target, newOptions);
        }
      }]);

      return StyledNativeComponent;
    }(ParentComponent);

    StyledNativeComponent.displayName = displayName;
    StyledNativeComponent.target = target;
    StyledNativeComponent.attrs = attrs;
    StyledNativeComponent.inlineStyle = inlineStyle;
    StyledNativeComponent.styledComponentId = 'StyledNativeComponent';


    return StyledNativeComponent;
  };

  return createStyledNativeComponent;
};

module.exports = exports['default'];