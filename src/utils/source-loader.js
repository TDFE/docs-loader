/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 19:13:28
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 19:13:29
 */

import path from 'path';
import scheduler from './scheduler';
import loaderUtils from 'loader-utils';
import { getPlugins, getTransformers } from './tool';
import runTask from './runTask';

module.exports = function sourceLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
  const fullPath = webpackRemainingChain[webpackRemainingChain.length - 1];
  const filename = path.relative(process.cwd(), fullPath);
  const plugins = getPlugins('node');

  const callback = this.async();
  const task = {
    filename,
    content,
    plugins,
    transformers: [getTransformers()],
    callback(err, result) {
      callback(err, `module.exports = ${result};`);
    },
  };
  if (typeof v8debug === 'undefined') {
    scheduler.queue(task);
  } else {
    runTask(task);
  }
}
