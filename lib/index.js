'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _sourceHandler = require('./utils/source-handler');

var _sourceHandler2 = _interopRequireDefault(_sourceHandler);

var _tool = require('./utils/tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function docsLoader() {
  if (this.cacheable) {
    this.cacheable();
  }
  var callback = this.async();
  var loaderOptions = _loaderUtils2.default.parseQuery(this.query);
  var transformers = loaderOptions.transformers.concat((0, _tool.getTransformers)()).map(function (_ref) {
    return { test: _ref.test.toString(), use: _ref.use };
  });
  var source = (0, _assign2.default)({}, loaderOptions.source);
  var markdown = _sourceHandler2.default.generate(source, transformers);
  var picked = {};
  var pickedPromises = [];
  if (loaderOptions.pick) {
    var nodePlugins = getPlugins('node');
    _sourceHandler2.default.traverse(markdown, function (filename) {
      var fileContent = _fs2.default.readFileSync(_path2.default.join(process.cwd(), filename)).toString();
      pickedPromises.push(new _promise2.default(function (resolve) {}));
    });
  }

  _promise2.default.all(pickedPromises).then(function () {
    var sourceDataString = _sourceHandler2.default.stringify(markdown, {
      lazyLoad: loaderOptions.lazyLoad,
      transformers: transformers
    });
    callback(null, 'module.exports = {\n markdown: "' + sourceDataString + '", \n picked: "' + (0, _stringify2.default)(picked, null, 2) + '"\n]\n}');
  });
}; /**
    * @Author: Zhengfeng.Yao <yzf>
    * @Date:   2017-06-02 17:13:27
    * @Last modified by:   yzf
    * @Last modified time: 2017-06-02 17:13:29
    */
//# sourceMappingURL=index.js.map