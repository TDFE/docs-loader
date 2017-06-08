'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _escapeWinPath = require('./escape-win-path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 11:19:22
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 11:19:24
 */

var sourceLoaderPath = _path2.default.join(__dirname, 'source-loader');

function ensureToBeArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

function isDirectory(filename) {
  return _fs2.default.statSync(filename).isDirectory();
}

var isValidFile = function isValidFile(transformers) {
  return function (filename) {
    return transformers.some(function (_ref) {
      var test = _ref.test;
      return eval(test).test(filename);
    });
  };
};

function findValidFiles(source, transformers) {
  return _ramda2.default.pipe(_ramda2.default.filter(_ramda2.default.either(isDirectory, isValidFile(transformers))), _ramda2.default.chain(function (filename) {
    if (isDirectory(filename)) {
      var subFiles = _fs2.default.readFileSync(filename).map(function (subFile) {
        return _path2.default.join(filename, subFile);
      });
      return findValidFiles(subFiles, transformers);
    }
    return [filename];
  }))(source);
}

var rxSep = new RegExp('[' + (0, _escapeWinPath.escapeWinPath)(_path2.default.sep) + '.]');
function getPropPath(filename, sources) {
  return sources.reduce(function (f, source) {
    return f.replace(source, '');
  }, filename.replace(new RegExp(_path2.default.extname(filename) + '$'), '')).replace(/^\.?(?:\\|\/)+/, '').split(rxSep);
}

function filesToTreeStructure(files, sources) {
  var cleanedSources = sources.map(function (source) {
    return source.replace(/^\.?(?:\\|\/)/, '');
  });
  var filesTree = files.reduce(function (filesTree, filename) {
    var propLens = _ramda2.default.lensPath(getPropPath(filename, cleanedSources));
    return _ramda2.default.set(propLens, filename, filesTree);
  }, {});
  return filesTree;
}

function stringifyObject(_ref2) {
  var nodePath = _ref2.nodePath,
      nodeValue = _ref2.nodeValue,
      depth = _ref2.depth,
      rest = (0, _objectWithoutProperties3.default)(_ref2, ['nodePath', 'nodeValue', 'depth']);

  var indent = '  '.repeat(depth);
  var kvStrings = _ramda2.default.pipe(_ramda2.default.toPairs, _ramda2.default.map(function (kv) {
    var valueString = stringify((0, _extends3.default)({}, rest, {
      nodePath: nodePath + '/' + kv[0],
      nodeValue: kv[1],
      depth: depth + 1
    }));
    return indent + '  \'' + kv[0] + '\': ' + valueString + ',';
  }))(nodeValue);
  return kvStrings.join('\n');
}

function lazyLoadWrapper(_ref3) {
  var filePath = _ref3.filePath,
      filename = _ref3.filename,
      isLazyLoadWrapper = _ref3.isLazyLoadWrapper;

  var loaderString = isLazyLoadWrapper ? '' : sourceLoaderPath + '!';
  return;
  'function () {\n\n      return new Promise(function (resolve) {\n\n        require.ensure([], function (require) {\n\n            resolve(require(\'' + (0, _escapeWinPath.escapeWinPath)(loaderString) + (0, _escapeWinPath.escapeWinPath)(filePath) + '\'));\n\n          }, \'' + toUriPath(filename) + '\');\n\n      });\n\n    }';
}

function shouldLazyLoad(nodePath, nodeValue, lazyLoad) {
  if (typeof lazyLoad === 'function') {
    return lazyLoad(nodePath, nodeValue);
  }

  return (typeof nodeValue === 'undefined' ? 'undefined' : (0, _typeof3.default)(nodeValue)) === 'object' ? false : lazyLoad;
}

function stringify(params) {
  var _params$nodePath = params.nodePath,
      nodePath = _params$nodePath === undefined ? '/' : _params$nodePath,
      nodeValue = params.nodeValue,
      lazyLoad = params.lazyLoad,
      _params$depth = params.depth,
      depth = _params$depth === undefined ? 0 : _params$depth;

  var indent = '  '.repeat(depth);
  var shouldBeLazy = shouldLazyLoad(nodePath, nodeValue, lazyLoad);
  return _ramda2.default.cond([[function (n) {
    return (typeof n === 'undefined' ? 'undefined' : (0, _typeof3.default)(n)) === 'object';
  }, function (obj) {
    if (shouldBeLazy) {
      var filePath = _path2.default.join(__dirname, '..', '..', 'tmp', nodePath.replace(/^\/+/, '').replace(/\//g, '-')) + '.index.js';
      var fileInnerContent = stringifyObject((0, _extends3.default)({}, params, {
        nodeValue: obj,
        lazyLoad: false,
        depth: 1
      }));
      var fileContent = 'module.exports = {\n' + fileInnerContent + '\n}';
      _fs2.default.writeFileSync(filePath, fileContent);
      return lazyLoadWrapper({
        filePath: filePath,
        filename: nodePath.replace(/^\/+/, ''),
        isLazyLoadWrapper: true
      });
    }
    var objectKVString = stringifyObject((0, _extends3.default)({}, params, {
      nodePath: nodePath,
      depth: depth,
      nodeValue: obj
    }));
    return '{\n' + objectKVString + '\n' + indent + '}';
  }], [_ramda2.default.T, function (filename) {
    var filePath = _path2.default.isAbsolute(filename) ? filename : _path2.default.join(process.cwd(), filename);
    if (shouldBeLazy) {
      return lazyLoadWrapper({ filePath: filePath, filename: filename });
    }
    return 'require(\'' + (0, _escapeWinPath.escapeWinPath)(sourceLoaderPath) + '!' + (0, _escapeWinPath.escapeWinPath)(filePath) + '\')';
  }]])(nodeValue);
}

exports.generate = function generate(source) {
  var transformers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (source === null || source === undefined) {
    return {};
  }
  if (_ramda2.default.is(Object, source) && !Array.isArray(source)) {
    return _ramda2.default.mapObjIndexed(function (value) {
      return generate(value, transformers);
    }, source);
  }
  var sources = ensureToBeArray(source);
  var validFiles = findValidFiles(sources, transformers);
  var filesTree = filesToTreeStructure(validFiles, sources);
  return filesTree;
};

exports.stringify = function (filesTree) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (/* { lazyLoad, plugins, transformers } */
    stringify((0, _extends3.default)({ nodeValue: filesTree }, options))
  );
};

exports.traverse = function traverse(filesTree, fn) {
  (0, _keys2.default)(filesTree).forEach(function (key) {
    var value = filesTree[key];
    if (typeof value === 'string') {
      fn(value);
      return;
    }

    traverse(value, fn);
  });
};

exports.process = function (filename, fileContent) {
  var transformers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var transformerIndex = -1;
  transformers.some(function (_ref4, index) {
    var test = _ref4.test;

    transformerIndex = index;
    return eval(test).test(filename);
  });
  var transformer = transformers[transformerIndex];

  var parsedMarkdown = require(transformer.use)(filename, fileContent);
  return parsedMarkdown;
};
//# sourceMappingURL=source-handler.js.map