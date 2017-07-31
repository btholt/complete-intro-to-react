'use strict';

exports.__esModule = true;

var _AbstractStyledCompon;

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ThemeProvider = require('./ThemeProvider');

var _StyleSheet = require('./StyleSheet');

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbstractStyledComponent = function (_Component) {
  _inherits(AbstractStyledComponent, _Component);

  function AbstractStyledComponent() {
    _classCallCheck(this, AbstractStyledComponent);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  return AbstractStyledComponent;
}(_react.Component);

exports.default = AbstractStyledComponent;


AbstractStyledComponent.contextTypes = (_AbstractStyledCompon = {}, _AbstractStyledCompon[_ThemeProvider.CHANNEL] = _propTypes2.default.func, _AbstractStyledCompon[_StyleSheet.CONTEXT_KEY] = _propTypes2.default.instanceOf(_StyleSheet2.default), _AbstractStyledCompon);
module.exports = exports['default'];