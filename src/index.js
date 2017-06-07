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
import resolvePlugins from './utils/resolve-plugins';

const plugins = [
  'highlight',
  'react?lang=__react',
  'toc?maxDepth=2&keepElem',
  'description'
];

module.exports = function docsLoader() {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  const loaderOptions = loaderUtils.parseQuery(this.query);
  const transformers = loaderOptions.transformers.concat({
    test: /\.md$/,
    use: path.join(__dirname, 'transformers', 'markdown')
  }).map(_ref => ({test: _ref.test.toString(), use: _ref.use}));
  const source = Object.assign({}, loaderOptions.source);
  const markdown = sourceHandler.generate(source, transformers);
  const browserPlugins = resolvePlugins(plugins, 'browser');
  const pluginsString = browserPlugins.map(plugin => `[require("${plugin[0]}"), "${JSON.stringify(plugin[1])}"]`).join(',\n');
  const picked = {};
  const pickedPromises = [];
  if (loaderOptions.pick) {
    const nodePlugins = resolvePlugins(plugins, 'node');
    sourceHandler.traverse(markdown, filename => {
      const fileContent = fs.readFileSync(path.join(process.cwd(), filename)).toString();
      pickedPromises.push(new Promise(resolve => {}));
    });
  }

  Promise.all(pickedPromises).then(() => {
    const sourceDataString = sourceHandler.stringify(markdown, {
      lazyLoad: loaderOptions.lazyLoad
    });
    callback(null, `module.exports = {\n markdown: "${sourceDataString}", \n picked: "${JSON.stringify(picked, null, 2)}", \n plugins: [\n"${pluginsString}"\n]\n}`);
  });
}
