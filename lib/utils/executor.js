'use strict';

var _sourceHandler = require('./source-handler');

var _sourceHandler2 = _interopRequireDefault(_sourceHandler);

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 17:42:14
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 17:42:17
 */

process.on('message', function (task) {
  var filename = task.filename,
      content = task.content,
      plugins = task.plugins,
      transformers = task.transformers;

  var parsedMarkdown = _sourceHandler2.default.process(filename, content, plugins, transformers);
  var result = (0, _stringify2.default)(parsedMarkdown);
  process.send(result);
});
//# sourceMappingURL=executor.js.map