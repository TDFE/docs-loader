/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 10:53:02
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 10:53:05
 */

import markTwain from 'mark-twain';
import { toUriPath } from '../utils/escape-win-path';

module.exports = function (filename, fileContent) {
  const markdown = markTwain(fileContent);
  markdown.meta.filename = toUriPath(filename);
  return markdown;
};
