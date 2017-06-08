'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _scheduler = require('./scheduler');

var _scheduler2 = _interopRequireDefault(_scheduler);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _tool = require('./tool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 19:13:28
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 19:13:29
 */

module.exports = function sourceLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  var webpackRemainingChain = _loaderUtils2.default.getRemainingRequest(this).split('!');
  var fullPath = webpackRemainingChain[webpackRemainingChain.length - 1];
  var filename = _path2.default.relative(process.cwd(), fullPath);

  var _callback = this.async();
  boss.queue({
    filename: filename,
    content: content,
    transformers: (0, _tool.getTransformers)(),
    callback: function callback(err, result) {
      _callback(err, 'module.exports = ' + result + ';');
    }
  });
};
//# sourceMappingURL=source-loader.js.map