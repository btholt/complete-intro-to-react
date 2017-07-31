'use strict';

var _staticRequire = require('../core/staticRequire');

var _staticRequire2 = _interopRequireDefault(_staticRequire);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */

const log = (0, _debug2.default)('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function containsNodeOrEqual(outerNode, innerNode) {
  return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];
}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }

  const body = scope.block.body;

  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(node => containsNodeOrEqual(node, nodeToFind));
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
}

module.exports = {
  meta: {
    docs: {},
    schema: [{
      'type': 'object',
      'properties': {
        'count': {
          'type': 'integer',
          'minimum': 1
        }
      },
      'additionalProperties': false
    }]
  },
  create: function (context) {
    let level = 0;
    const requireCalls = [];

    function checkForNewLine(node, nextNode, type) {
      if (isClassWithDecorator(nextNode)) {
        nextNode = nextNode.decorators[0];
      }

      const options = context.options[0] || { count: 1 };
      if (getLineDifference(node, nextNode) < options.count + 1) {
        let column = node.loc.start.column;

        if (node.loc.start.line !== node.loc.end.line) {
          column = 0;
        }

        context.report({
          loc: {
            line: node.loc.end.line,
            column
          },
          message: `Expected empty line after ${type} statement not followed by another ${type}.`
        });
      }
    }

    function incrementLevel() {
      level++;
    }
    function decrementLevel() {
      level--;
    }

    return {
      ImportDeclaration: function (node) {
        const parent = node.parent;

        const nodePosition = parent.body.indexOf(node);
        const nextNode = parent.body[nodePosition + 1];

        if (nextNode && nextNode.type !== 'ImportDeclaration') {
          checkForNewLine(node, nextNode, 'import');
        }
      },
      CallExpression: function (node) {
        if ((0, _staticRequire2.default)(node) && level === 0) {
          requireCalls.push(node);
        }
      },
      'Program:exit': function () {
        log('exit processing for', context.getFilename());
        const scopeBody = getScopeBody(context.getScope());
        log('got scope:', scopeBody);

        requireCalls.forEach(function (node, index) {
          const nodePosition = findNodeIndexInScopeBody(scopeBody, node);
          log('node position in scope:', nodePosition);

          const statementWithRequireCall = scopeBody[nodePosition];
          const nextStatement = scopeBody[nodePosition + 1];
          const nextRequireCall = requireCalls[index + 1];

          if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
            return;
          }

          if (nextStatement && (!nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

            checkForNewLine(statementWithRequireCall, nextStatement, 'require');
          }
        });
      },
      FunctionDeclaration: incrementLevel,
      FunctionExpression: incrementLevel,
      ArrowFunctionExpression: incrementLevel,
      BlockStatement: incrementLevel,
      ObjectExpression: incrementLevel,
      Decorator: incrementLevel,
      'FunctionDeclaration:exit': decrementLevel,
      'FunctionExpression:exit': decrementLevel,
      'ArrowFunctionExpression:exit': decrementLevel,
      'BlockStatement:exit': decrementLevel,
      'ObjectExpression:exit': decrementLevel,
      'Decorator:exit': decrementLevel
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25ld2xpbmUtYWZ0ZXItaW1wb3J0LmpzIl0sIm5hbWVzIjpbImxvZyIsImNvbnRhaW5zTm9kZU9yRXF1YWwiLCJvdXRlck5vZGUiLCJpbm5lck5vZGUiLCJyYW5nZSIsImdldFNjb3BlQm9keSIsInNjb3BlIiwiYmxvY2siLCJ0eXBlIiwiYm9keSIsImZpbmROb2RlSW5kZXhJblNjb3BlQm9keSIsIm5vZGVUb0ZpbmQiLCJmaW5kSW5kZXgiLCJub2RlIiwiZ2V0TGluZURpZmZlcmVuY2UiLCJuZXh0Tm9kZSIsImxvYyIsInN0YXJ0IiwibGluZSIsImVuZCIsImlzQ2xhc3NXaXRoRGVjb3JhdG9yIiwiZGVjb3JhdG9ycyIsImxlbmd0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJsZXZlbCIsInJlcXVpcmVDYWxscyIsImNoZWNrRm9yTmV3TGluZSIsIm9wdGlvbnMiLCJjb3VudCIsImNvbHVtbiIsInJlcG9ydCIsIm1lc3NhZ2UiLCJpbmNyZW1lbnRMZXZlbCIsImRlY3JlbWVudExldmVsIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJwYXJlbnQiLCJub2RlUG9zaXRpb24iLCJpbmRleE9mIiwiQ2FsbEV4cHJlc3Npb24iLCJwdXNoIiwiZ2V0RmlsZW5hbWUiLCJzY29wZUJvZHkiLCJnZXRTY29wZSIsImZvckVhY2giLCJpbmRleCIsInN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCIsIm5leHRTdGF0ZW1lbnQiLCJuZXh0UmVxdWlyZUNhbGwiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJCbG9ja1N0YXRlbWVudCIsIk9iamVjdEV4cHJlc3Npb24iLCJEZWNvcmF0b3IiXSwibWFwcGluZ3MiOiI7O0FBS0E7Ozs7QUFFQTs7Ozs7O0FBUEE7Ozs7O0FBUUEsTUFBTUEsTUFBTSxxQkFBTSxpREFBTixDQUFaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTQyxtQkFBVCxDQUE2QkMsU0FBN0IsRUFBd0NDLFNBQXhDLEVBQW1EO0FBQy9DLFNBQU9ELFVBQVVFLEtBQVYsQ0FBZ0IsQ0FBaEIsS0FBc0JELFVBQVVDLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBdEIsSUFBNENGLFVBQVVFLEtBQVYsQ0FBZ0IsQ0FBaEIsS0FBc0JELFVBQVVDLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FBekU7QUFDSDs7QUFFRCxTQUFTQyxZQUFULENBQXNCQyxLQUF0QixFQUE2QjtBQUN6QixNQUFJQSxNQUFNQyxLQUFOLENBQVlDLElBQVosS0FBcUIsaUJBQXpCLEVBQTRDO0FBQzFDUixRQUFJLHNDQUFKO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBSndCLFFBTWpCUyxJQU5pQixHQU1SSCxNQUFNQyxLQU5FLENBTWpCRSxJQU5pQjs7QUFPekIsTUFBSUEsUUFBUUEsS0FBS0QsSUFBTCxLQUFjLGdCQUExQixFQUE0QztBQUN4QyxXQUFPQyxLQUFLQSxJQUFaO0FBQ0g7O0FBRUQsU0FBT0EsSUFBUDtBQUNIOztBQUVELFNBQVNDLHdCQUFULENBQWtDRCxJQUFsQyxFQUF3Q0UsVUFBeEMsRUFBb0Q7QUFDaEQsU0FBT0YsS0FBS0csU0FBTCxDQUFnQkMsSUFBRCxJQUFVWixvQkFBb0JZLElBQXBCLEVBQTBCRixVQUExQixDQUF6QixDQUFQO0FBQ0g7O0FBRUQsU0FBU0csaUJBQVQsQ0FBMkJELElBQTNCLEVBQWlDRSxRQUFqQyxFQUEyQztBQUN6QyxTQUFPQSxTQUFTQyxHQUFULENBQWFDLEtBQWIsQ0FBbUJDLElBQW5CLEdBQTBCTCxLQUFLRyxHQUFMLENBQVNHLEdBQVQsQ0FBYUQsSUFBOUM7QUFDRDs7QUFFRCxTQUFTRSxvQkFBVCxDQUE4QlAsSUFBOUIsRUFBb0M7QUFDbEMsU0FBT0EsS0FBS0wsSUFBTCxLQUFjLGtCQUFkLElBQW9DSyxLQUFLUSxVQUF6QyxJQUF1RFIsS0FBS1EsVUFBTCxDQUFnQkMsTUFBOUU7QUFDRDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sRUFERjtBQUVKQyxZQUFRLENBQ047QUFDRSxjQUFRLFFBRFY7QUFFRSxvQkFBYztBQUNaLGlCQUFTO0FBQ1Asa0JBQVEsU0FERDtBQUVQLHFCQUFXO0FBRko7QUFERyxPQUZoQjtBQVFFLDhCQUF3QjtBQVIxQixLQURNO0FBRkosR0FEUztBQWdCZkMsVUFBUSxVQUFVQyxPQUFWLEVBQW1CO0FBQ3pCLFFBQUlDLFFBQVEsQ0FBWjtBQUNBLFVBQU1DLGVBQWUsRUFBckI7O0FBRUEsYUFBU0MsZUFBVCxDQUF5Qm5CLElBQXpCLEVBQStCRSxRQUEvQixFQUF5Q1AsSUFBekMsRUFBK0M7QUFDN0MsVUFBSVkscUJBQXFCTCxRQUFyQixDQUFKLEVBQW9DO0FBQ2xDQSxtQkFBV0EsU0FBU00sVUFBVCxDQUFvQixDQUFwQixDQUFYO0FBQ0Q7O0FBRUQsWUFBTVksVUFBVUosUUFBUUksT0FBUixDQUFnQixDQUFoQixLQUFzQixFQUFFQyxPQUFPLENBQVQsRUFBdEM7QUFDQSxVQUFJcEIsa0JBQWtCRCxJQUFsQixFQUF3QkUsUUFBeEIsSUFBb0NrQixRQUFRQyxLQUFSLEdBQWdCLENBQXhELEVBQTJEO0FBQ3pELFlBQUlDLFNBQVN0QixLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZWtCLE1BQTVCOztBQUVBLFlBQUl0QixLQUFLRyxHQUFMLENBQVNDLEtBQVQsQ0FBZUMsSUFBZixLQUF3QkwsS0FBS0csR0FBTCxDQUFTRyxHQUFULENBQWFELElBQXpDLEVBQStDO0FBQzdDaUIsbUJBQVMsQ0FBVDtBQUNEOztBQUVETixnQkFBUU8sTUFBUixDQUFlO0FBQ2JwQixlQUFLO0FBQ0hFLGtCQUFNTCxLQUFLRyxHQUFMLENBQVNHLEdBQVQsQ0FBYUQsSUFEaEI7QUFFSGlCO0FBRkcsV0FEUTtBQUtiRSxtQkFBVSw2QkFBNEI3QixJQUFLLHNDQUFxQ0EsSUFBSztBQUx4RSxTQUFmO0FBT0Q7QUFDRjs7QUFFRCxhQUFTOEIsY0FBVCxHQUEwQjtBQUN4QlI7QUFDRDtBQUNELGFBQVNTLGNBQVQsR0FBMEI7QUFDeEJUO0FBQ0Q7O0FBRUQsV0FBTztBQUNMVSx5QkFBbUIsVUFBVTNCLElBQVYsRUFBZ0I7QUFBQSxjQUN6QjRCLE1BRHlCLEdBQ2Q1QixJQURjLENBQ3pCNEIsTUFEeUI7O0FBRWpDLGNBQU1DLGVBQWVELE9BQU9oQyxJQUFQLENBQVlrQyxPQUFaLENBQW9COUIsSUFBcEIsQ0FBckI7QUFDQSxjQUFNRSxXQUFXMEIsT0FBT2hDLElBQVAsQ0FBWWlDLGVBQWUsQ0FBM0IsQ0FBakI7O0FBRUEsWUFBSTNCLFlBQVlBLFNBQVNQLElBQVQsS0FBa0IsbUJBQWxDLEVBQXVEO0FBQ3JEd0IsMEJBQWdCbkIsSUFBaEIsRUFBc0JFLFFBQXRCLEVBQWdDLFFBQWhDO0FBQ0Q7QUFDRixPQVRJO0FBVUw2QixzQkFBZ0IsVUFBUy9CLElBQVQsRUFBZTtBQUM3QixZQUFJLDZCQUFnQkEsSUFBaEIsS0FBeUJpQixVQUFVLENBQXZDLEVBQTBDO0FBQ3hDQyx1QkFBYWMsSUFBYixDQUFrQmhDLElBQWxCO0FBQ0Q7QUFDRixPQWRJO0FBZUwsc0JBQWdCLFlBQVk7QUFDMUJiLFlBQUkscUJBQUosRUFBMkI2QixRQUFRaUIsV0FBUixFQUEzQjtBQUNBLGNBQU1DLFlBQVkxQyxhQUFhd0IsUUFBUW1CLFFBQVIsRUFBYixDQUFsQjtBQUNBaEQsWUFBSSxZQUFKLEVBQWtCK0MsU0FBbEI7O0FBRUFoQixxQkFBYWtCLE9BQWIsQ0FBcUIsVUFBVXBDLElBQVYsRUFBZ0JxQyxLQUFoQixFQUF1QjtBQUMxQyxnQkFBTVIsZUFBZWhDLHlCQUF5QnFDLFNBQXpCLEVBQW9DbEMsSUFBcEMsQ0FBckI7QUFDQWIsY0FBSSx5QkFBSixFQUErQjBDLFlBQS9COztBQUVBLGdCQUFNUywyQkFBMkJKLFVBQVVMLFlBQVYsQ0FBakM7QUFDQSxnQkFBTVUsZ0JBQWdCTCxVQUFVTCxlQUFlLENBQXpCLENBQXRCO0FBQ0EsZ0JBQU1XLGtCQUFrQnRCLGFBQWFtQixRQUFRLENBQXJCLENBQXhCOztBQUVBLGNBQUlHLG1CQUFtQnBELG9CQUFvQmtELHdCQUFwQixFQUE4Q0UsZUFBOUMsQ0FBdkIsRUFBdUY7QUFDckY7QUFDRDs7QUFFRCxjQUFJRCxrQkFDQSxDQUFDQyxlQUFELElBQW9CLENBQUNwRCxvQkFBb0JtRCxhQUFwQixFQUFtQ0MsZUFBbkMsQ0FEckIsQ0FBSixFQUMrRTs7QUFFN0VyQiw0QkFBZ0JtQix3QkFBaEIsRUFBMENDLGFBQTFDLEVBQXlELFNBQXpEO0FBQ0Q7QUFDRixTQWpCRDtBQWtCRCxPQXRDSTtBQXVDTEUsMkJBQXFCaEIsY0F2Q2hCO0FBd0NMaUIsMEJBQW9CakIsY0F4Q2Y7QUF5Q0xrQiwrQkFBeUJsQixjQXpDcEI7QUEwQ0xtQixzQkFBZ0JuQixjQTFDWDtBQTJDTG9CLHdCQUFrQnBCLGNBM0NiO0FBNENMcUIsaUJBQVdyQixjQTVDTjtBQTZDTCxrQ0FBNEJDLGNBN0N2QjtBQThDTCxpQ0FBMkJBLGNBOUN0QjtBQStDTCxzQ0FBZ0NBLGNBL0MzQjtBQWdETCw2QkFBdUJBLGNBaERsQjtBQWlETCwrQkFBeUJBLGNBakRwQjtBQWtETCx3QkFBa0JBO0FBbERiLEtBQVA7QUFvREQ7QUF0R2MsQ0FBakIiLCJmaWxlIjoicnVsZXMvbmV3bGluZS1hZnRlci1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBlbmZvcmNlIG5ldyBsaW5lIGFmdGVyIGltcG9ydCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuXG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJ1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBsb2cgPSBkZWJ1ZygnZXNsaW50LXBsdWdpbi1pbXBvcnQ6cnVsZXM6bmV3bGluZS1hZnRlci1pbXBvcnQnKVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb250YWluc05vZGVPckVxdWFsKG91dGVyTm9kZSwgaW5uZXJOb2RlKSB7XG4gICAgcmV0dXJuIG91dGVyTm9kZS5yYW5nZVswXSA8PSBpbm5lck5vZGUucmFuZ2VbMF0gJiYgb3V0ZXJOb2RlLnJhbmdlWzFdID49IGlubmVyTm9kZS5yYW5nZVsxXVxufVxuXG5mdW5jdGlvbiBnZXRTY29wZUJvZHkoc2NvcGUpIHtcbiAgICBpZiAoc2NvcGUuYmxvY2sudHlwZSA9PT0gJ1N3aXRjaFN0YXRlbWVudCcpIHtcbiAgICAgIGxvZygnU3dpdGNoU3RhdGVtZW50IHNjb3BlcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgeyBib2R5IH0gPSBzY29wZS5ibG9ja1xuICAgIGlmIChib2R5ICYmIGJvZHkudHlwZSA9PT0gJ0Jsb2NrU3RhdGVtZW50Jykge1xuICAgICAgICByZXR1cm4gYm9keS5ib2R5XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHlcbn1cblxuZnVuY3Rpb24gZmluZE5vZGVJbmRleEluU2NvcGVCb2R5KGJvZHksIG5vZGVUb0ZpbmQpIHtcbiAgICByZXR1cm4gYm9keS5maW5kSW5kZXgoKG5vZGUpID0+IGNvbnRhaW5zTm9kZU9yRXF1YWwobm9kZSwgbm9kZVRvRmluZCkpXG59XG5cbmZ1bmN0aW9uIGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHROb2RlKSB7XG4gIHJldHVybiBuZXh0Tm9kZS5sb2Muc3RhcnQubGluZSAtIG5vZGUubG9jLmVuZC5saW5lXG59XG5cbmZ1bmN0aW9uIGlzQ2xhc3NXaXRoRGVjb3JhdG9yKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0NsYXNzRGVjbGFyYXRpb24nICYmIG5vZGUuZGVjb3JhdG9ycyAmJiBub2RlLmRlY29yYXRvcnMubGVuZ3RoXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgZG9jczoge30sXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgICd0eXBlJzogJ29iamVjdCcsXG4gICAgICAgICdwcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdjb3VudCc6IHtcbiAgICAgICAgICAgICd0eXBlJzogJ2ludGVnZXInLFxuICAgICAgICAgICAgJ21pbmltdW0nOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdhZGRpdGlvbmFsUHJvcGVydGllcyc6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgbGV0IGxldmVsID0gMFxuICAgIGNvbnN0IHJlcXVpcmVDYWxscyA9IFtdXG5cbiAgICBmdW5jdGlvbiBjaGVja0Zvck5ld0xpbmUobm9kZSwgbmV4dE5vZGUsIHR5cGUpIHtcbiAgICAgIGlmIChpc0NsYXNzV2l0aERlY29yYXRvcihuZXh0Tm9kZSkpIHtcbiAgICAgICAgbmV4dE5vZGUgPSBuZXh0Tm9kZS5kZWNvcmF0b3JzWzBdXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwgeyBjb3VudDogMSB9XG4gICAgICBpZiAoZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dE5vZGUpIDwgb3B0aW9ucy5jb3VudCArIDEpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5vZGUubG9jLnN0YXJ0LmNvbHVtblxuXG4gICAgICAgIGlmIChub2RlLmxvYy5zdGFydC5saW5lICE9PSBub2RlLmxvYy5lbmQubGluZSkge1xuICAgICAgICAgIGNvbHVtbiA9IDBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBsb2M6IHtcbiAgICAgICAgICAgIGxpbmU6IG5vZGUubG9jLmVuZC5saW5lLFxuICAgICAgICAgICAgY29sdW1uLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogYEV4cGVjdGVkIGVtcHR5IGxpbmUgYWZ0ZXIgJHt0eXBlfSBzdGF0ZW1lbnQgbm90IGZvbGxvd2VkIGJ5IGFub3RoZXIgJHt0eXBlfS5gLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluY3JlbWVudExldmVsKCkge1xuICAgICAgbGV2ZWwrK1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZWNyZW1lbnRMZXZlbCgpIHtcbiAgICAgIGxldmVsLS1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb246IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGNvbnN0IHsgcGFyZW50IH0gPSBub2RlXG4gICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IHBhcmVudC5ib2R5LmluZGV4T2Yobm9kZSlcbiAgICAgICAgY29uc3QgbmV4dE5vZGUgPSBwYXJlbnQuYm9keVtub2RlUG9zaXRpb24gKyAxXVxuXG4gICAgICAgIGlmIChuZXh0Tm9kZSAmJiBuZXh0Tm9kZS50eXBlICE9PSAnSW1wb3J0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCAnaW1wb3J0JylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENhbGxFeHByZXNzaW9uOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIGlmIChpc1N0YXRpY1JlcXVpcmUobm9kZSkgJiYgbGV2ZWwgPT09IDApIHtcbiAgICAgICAgICByZXF1aXJlQ2FsbHMucHVzaChub2RlKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9nKCdleGl0IHByb2Nlc3NpbmcgZm9yJywgY29udGV4dC5nZXRGaWxlbmFtZSgpKVxuICAgICAgICBjb25zdCBzY29wZUJvZHkgPSBnZXRTY29wZUJvZHkoY29udGV4dC5nZXRTY29wZSgpKVxuICAgICAgICBsb2coJ2dvdCBzY29wZTonLCBzY29wZUJvZHkpXG5cbiAgICAgICAgcmVxdWlyZUNhbGxzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUsIGluZGV4KSB7XG4gICAgICAgICAgY29uc3Qgbm9kZVBvc2l0aW9uID0gZmluZE5vZGVJbmRleEluU2NvcGVCb2R5KHNjb3BlQm9keSwgbm9kZSlcbiAgICAgICAgICBsb2coJ25vZGUgcG9zaXRpb24gaW4gc2NvcGU6Jywgbm9kZVBvc2l0aW9uKVxuXG4gICAgICAgICAgY29uc3Qgc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsID0gc2NvcGVCb2R5W25vZGVQb3NpdGlvbl1cbiAgICAgICAgICBjb25zdCBuZXh0U3RhdGVtZW50ID0gc2NvcGVCb2R5W25vZGVQb3NpdGlvbiArIDFdXG4gICAgICAgICAgY29uc3QgbmV4dFJlcXVpcmVDYWxsID0gcmVxdWlyZUNhbGxzW2luZGV4ICsgMV1cblxuICAgICAgICAgIGlmIChuZXh0UmVxdWlyZUNhbGwgJiYgY29udGFpbnNOb2RlT3JFcXVhbChzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRSZXF1aXJlQ2FsbCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXh0U3RhdGVtZW50ICYmXG4gICAgICAgICAgICAgKCFuZXh0UmVxdWlyZUNhbGwgfHwgIWNvbnRhaW5zTm9kZU9yRXF1YWwobmV4dFN0YXRlbWVudCwgbmV4dFJlcXVpcmVDYWxsKSkpIHtcblxuICAgICAgICAgICAgY2hlY2tGb3JOZXdMaW5lKHN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCwgbmV4dFN0YXRlbWVudCwgJ3JlcXVpcmUnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBCbG9ja1N0YXRlbWVudDogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBPYmplY3RFeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIERlY29yYXRvcjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25EZWNsYXJhdGlvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25FeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQmxvY2tTdGF0ZW1lbnQ6ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ09iamVjdEV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0RlY29yYXRvcjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgfVxuICB9LFxufVxuIl19