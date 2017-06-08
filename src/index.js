/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-02 17:13:27
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-02 17:13:29
 */

import fs from 'fs';
import path from 'path';
import loaderUtils from 'loader-utils';
import sourceHandler from './utils/source-handler';
import { getTransformers } from './utils/tool';

module.exports = function docsLoader() {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  const loaderOptions = loaderUtils.parseQuery(this.query);
  const transformers = loaderOptions.transformers.concat(getTransformers()).map(_ref => ({test: _ref.test.toString(), use: _ref.use}));
  const source = Object.assign({}, loaderOptions.source);
  const markdown = sourceHandler.generate(source, transformers);
  const picked = {};
  const pickedPromises = [];
  if (loaderOptions.pick) {
    const nodePlugins = getPlugins('node');
    sourceHandler.traverse(markdown, filename => {
      const fileContent = fs.readFileSync(path.join(process.cwd(), filename)).toString();
      pickedPromises.push(new Promise(resolve => {}));
    });
  }

  Promise.all(pickedPromises).then(() => {
    const sourceDataString = sourceHandler.stringify(markdown, {
      lazyLoad: loaderOptions.lazyLoad,
      transformers
    });
    callback(null, `module.exports = {\n markdown: "${sourceDataString}", \n picked: "${JSON.stringify(picked, null, 2)}"\n]\n}`);
  });
}
