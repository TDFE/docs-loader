/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 14:05:23
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 14:05:24
 */

import babel from 'babel-core';
import types from 'babel-types';
import traverse from 'babel-traverse';
import generator from 'babel-generator';

const errorBoxStyle = {
  padding: 10,
  background: 'rgb(204, 0, 0)',
  color: 'white',
  fontFamily: 'sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  overflow: 'auto',
};

function requireGenerator(varName, moduleName) {
  return types.variableDeclaration('var', [
    types.variableDeclarator(
      types.identifier(varName),
      types.callExpression(
        types.identifier('require'),
        [types.stringLiteral(moduleName)]
      )
    ),
  ]);
}

const defaultBabelConfig = {
  presets: ['es2015-ie', 'react', 'stage-2'],
};

module.exports = function transformer(
  code,
  babelConfig = {},
  noreact
) {
  let codeAst = null;
  try {
    const { ast } = babel.transform(code, Object.assign({}, defaultBabelConfig, babelConfig));
    codeAst = ast;
  } catch(e) {
    console.error(e);
    return `function() { ` +
      `  var React = require('react');` +
      `  return React.createElement('pre', {` +
      `    style: ${JSON.stringify(errorBoxStyle)}` +
      `  }, '${e.toString()}'); ` +
      `}`;
  }

  let renderReturn = null;
  traverse(codeAst, {
    CallExpression: function(callPath) {
      const callPathNode = callPath.node;
      if (callPathNode.callee &&
          callPathNode.callee.object &&
          callPathNode.callee.object.name === 'ReactDOM' &&
          callPathNode.callee.property &&
          callPathNode.callee.property.name === 'render') {

        renderReturn = types.returnStatement(
          callPathNode.arguments[0]
        );

        callPath.remove();
      }
    },
  });

  const astProgramBody = codeAst.program.body;
  if (!noreact) {
    astProgramBody.unshift(requireGenerator('ReactDOM', 'react-dom'));
    astProgramBody.unshift(requireGenerator('React', 'react'));
  }
  // ReactDOM.render always at the last of preview method
  if (renderReturn) {
    astProgramBody.push(renderReturn);
  }

  const codeBlock = types.BlockStatement(astProgramBody);
  const previewFunction = types.functionDeclaration(
    types.Identifier('docsReactPreviewer'),
    [],
    codeBlock
  );

  return generator(types.program([previewFunction]), null, code).code;
};
