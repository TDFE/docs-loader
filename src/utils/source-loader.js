/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 19:13:28
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 19:13:29
 */

import path from 'path';
import scheduler from './scheduler';
import loaderUtils from 'loader-utils';
import { getTransformers } from './tool';

module.exports = function sourceLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
  const fullPath = webpackRemainingChain[webpackRemainingChain.length - 1];
  const filename = path.relative(process.cwd(), fullPath);

  const callback = this.async();
  boss.queue({
    filename,
    content,
    transformers: getTransformers(),
    callback(err, result) {
      callback(err, `module.exports = ${result};`);
    },
  });
}
