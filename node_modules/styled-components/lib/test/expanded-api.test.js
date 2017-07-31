'use strict';

var _templateObject = _taggedTemplateLiteralLoose([''], ['']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

var styled = void 0;

describe('expanded api', function () {
  /**
   * Make sure the setup is the same for every test
   */
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  describe('displayName', function () {
    it('should be auto-generated if none passed', function () {
      var Comp = styled.div(_templateObject);
      expect(Comp.displayName).toBe('styled.div');
    });

    it('should be attached if supplied', function () {
      var Comp = styled.div.withConfig({ displayName: 'Comp' })(_templateObject);
      expect(Comp.displayName).toBe('Comp');
    });
  });

  describe('componentId', function () {
    it('should be generated as "sc" + hash', function () {
      var Comp = styled.div(_templateObject);
      var Comp2 = styled.div(_templateObject);
      expect(Comp.styledComponentId).toBe('sc-a');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toMatch(/sc-a/);
      expect(Comp2.styledComponentId).toBe('sc-b');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp2, null)).prop('className')).toMatch(/sc-b/);
    });

    it('should be generated from displayName + hash', function () {
      var Comp = styled.div.withConfig({ displayName: 'Comp' })(_templateObject);
      var Comp2 = styled.div.withConfig({ displayName: 'Comp2' })(_templateObject);
      expect(Comp.styledComponentId).toBe('Comp-a');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toMatch(/Comp-a/);
      expect(Comp2.styledComponentId).toBe('Comp2-b');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp2, null)).prop('className')).toMatch(/Comp2-b/);
    });

    it('should be attached if passed in', function () {
      var Comp = styled.div.withConfig({ componentId: 'LOLOMG' })(_templateObject);
      var Comp2 = styled.div.withConfig({ componentId: 'OMGLOL' })(_templateObject);
      expect(Comp.styledComponentId).toBe('LOLOMG');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toMatch(/LOLOMG/);
      expect(Comp2.styledComponentId).toBe('OMGLOL');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp2, null)).prop('className')).toMatch(/OMGLOL/);
    });

    it('should be combined with displayName if both passed in', function () {
      var Comp = styled.div.withConfig({ displayName: 'Comp', componentId: 'LOLOMG' })(_templateObject);
      var Comp2 = styled.div.withConfig({ displayName: 'Comp2', componentId: 'OMGLOL' })(_templateObject);
      expect(Comp.styledComponentId).toBe('Comp-LOLOMG');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toMatch(/Comp-LOLOMG/);
      expect(Comp2.styledComponentId).toBe('Comp2-OMGLOL');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp2, null)).prop('className')).toMatch(/Comp2-OMGLOL/);
    });
  });

  describe('chaining', function () {
    it('should merge the options strings', function () {
      var Comp = styled.div.withConfig({ componentId: 'id-1' }).withConfig({ displayName: 'dn-2' })(_templateObject);
      expect(Comp.displayName).toBe('dn-2');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toBe('dn-2-id-1 a');
    });

    it('should keep the last value passed in when merging', function () {
      var Comp = styled.div.withConfig({ displayName: 'dn-2', componentId: 'id-3' }).withConfig({ displayName: 'dn-5', componentId: 'id-4' })(_templateObject);
      expect(Comp.displayName).toBe('dn-5');
      expect((0, _enzyme.shallow)(_react2.default.createElement(Comp, null)).prop('className')).toBe('dn-5-id-4 a');
    });
  });
});