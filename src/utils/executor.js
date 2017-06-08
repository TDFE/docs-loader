/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 17:42:14
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 17:42:17
 */

import sourceHandler from './source-handler';
import stringify from './stringify';

process.on('message', task => {
  const filename = task.filename,
      content = task.content,
      transformers = task.transformers;

  const parsedMarkdown = sourceHandler.process(filename, content, transformers);
  const result = stringify(parsedMarkdown);
  process.send(result);
});

module.exports = task => {
  const filename = task.filename,
      content = task.content,
      transformers = task.transformers;

  const parsedMarkdown = sourceHandler.process(filename, content, transformers);
  const result = stringify(parsedMarkdown);
  task.callback(null, result);
};
