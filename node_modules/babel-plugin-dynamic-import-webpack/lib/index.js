Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _babelPluginSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

var _babelPluginSyntaxDynamicImport2 = _interopRequireDefault(_babelPluginSyntaxDynamicImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TYPE_IMPORT = 'Import';

var buildImport = (0, _babelTemplate2['default'])('\n  (new Promise((resolve) => {\n    require.ensure([], (require) => {\n      resolve(require(SOURCE));\n    });\n  }))\n');

exports['default'] = function () {
  return {
    inherits: _babelPluginSyntaxDynamicImport2['default'],

    visitor: {
      CallExpression: function () {
        function CallExpression(path) {
          if (path.node.callee.type === TYPE_IMPORT) {
            var newImport = buildImport({
              SOURCE: path.node.arguments
            });
            path.replaceWith(newImport);
          }
        }

        return CallExpression;
      }()
    }
  };
};