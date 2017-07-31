'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('../../test/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styled = void 0;


describe('basic', function () {
  beforeEach(function () {
    styled = (0, _utils.resetNoParserStyled)();
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

  it('should correctly assemble preprocessed CSS', function () {
    var Comp = styled.div([['{ color: red; }']]);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b{ color: red; }');
  });

  it('should correctly execute passed functions and assemble preprocessed CSS', function () {
    var Comp = styled.div([['{ color: ', function () {
      return 'red';
    }, '; }']]);
    (0, _enzyme.shallow)(_react2.default.createElement(Comp, null));
    (0, _utils.expectCSSMatches)('.sc-a {} .b{ color: red; }');
  });
});