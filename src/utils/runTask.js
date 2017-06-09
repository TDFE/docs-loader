/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-09 09:49:43
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-09 09:49:52
 */

import sourceHandler from './source-handler';
import stringify from './stringify';

module.exports = task => {
  const filename = task.filename,
      content = task.content,
      plugins = task.plugins,
      transformers = task.transformers;

  const parsedMarkdown = sourceHandler.process(filename, content, plugins, transformers);
  const result = stringify(parsedMarkdown);
  return task.callback(null, result);
}
