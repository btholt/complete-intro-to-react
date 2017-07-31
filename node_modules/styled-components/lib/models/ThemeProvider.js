'use strict';

exports.__esModule = true;
exports.CHANNEL = undefined;

var _ThemeProvider$childC, _ThemeProvider$contex;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isFunction = require('is-function');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('is-plain-object');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _createBroadcast = require('../utils/create-broadcast');

var _createBroadcast2 = _interopRequireDefault(_createBroadcast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/* globals React$Element */


// NOTE: DO NOT CHANGE, changing this is a semver major change!
var babelPluginFlowReactPropTypes_proptype_Broadcast = require('../utils/create-broadcast').babelPluginFlowReactPropTypes_proptype_Broadcast || require('prop-types').any;

var CHANNEL = exports.CHANNEL = '__styled-components__';

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Theme', {
  value: require('prop-types').shape({})
});

/**
 * Provide a theme to an entire react component tree via context and event listeners (have to do
 * both context and event emitter as pure components block context updates)
 */
var ThemeProvider = function (_Component) {
  _inherits(ThemeProvider, _Component);

  function ThemeProvider() {
    _classCallCheck(this, ThemeProvider);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.getTheme = _this.getTheme.bind(_this);
    return _this;
  }

  ThemeProvider.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    // If there is a ThemeProvider wrapper anywhere around this theme provider, merge this theme
    // with the outer theme
    if (this.context[CHANNEL]) {
      var subscribe = this.context[CHANNEL];
      this.unsubscribeToOuter = subscribe(function (theme) {
        _this2.outerTheme = theme;
      });
    }
    this.broadcast = (0, _createBroadcast2.default)(this.getTheme());
  };

  ThemeProvider.prototype.getChildContext = function getChildContext() {
    var _extends2;

    return _extends({}, this.context, (_extends2 = {}, _extends2[CHANNEL] = this.broadcast.subscribe, _extends2));
  };

  ThemeProvider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (this.props.theme !== nextProps.theme) this.broadcast.publish(this.getTheme(nextProps.theme));
  };

  ThemeProvider.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.context[CHANNEL]) {
      this.unsubscribeToOuter();
    }
  };

  // Get the theme from the props, supporting both (outerTheme) => {} as well as object notation


  ThemeProvider.prototype.getTheme = function getTheme(passedTheme) {
    var theme = passedTheme || this.props.theme;
    if ((0, _isFunction2.default)(theme)) {
      var mergedTheme = theme(this.outerTheme);
      if (!(0, _isPlainObject2.default)(mergedTheme)) {
        throw new Error('[ThemeProvider] Please return an object from your theme function, i.e. theme={() => ({})}!');
      }
      return mergedTheme;
    }
    if (!(0, _isPlainObject2.default)(theme)) {
      throw new Error('[ThemeProvider] Please make your theme prop a plain object');
    }
    return _extends({}, this.outerTheme, theme);
  };

  ThemeProvider.prototype.render = function render() {
    if (!this.props.children) {
      return null;
    }
    return _react2.default.Children.only(this.props.children);
  };

  return ThemeProvider;
}(_react.Component);

ThemeProvider.propTypes = {
  children: require('prop-types').any,
  theme: require('prop-types').oneOfType([require('prop-types').shape({}), require('prop-types').func]).isRequired
};


ThemeProvider.childContextTypes = (_ThemeProvider$childC = {}, _ThemeProvider$childC[CHANNEL] = _propTypes2.default.func.isRequired, _ThemeProvider$childC);
ThemeProvider.contextTypes = (_ThemeProvider$contex = {}, _ThemeProvider$contex[CHANNEL] = _propTypes2.default.func, _ThemeProvider$contex);

exports.default = ThemeProvider;