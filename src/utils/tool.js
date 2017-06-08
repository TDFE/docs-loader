/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 09:57:06
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 09:57:09
 */

import path from 'path';
import resolvePlugins from './resolve-plugins';

const plugins = [
 'highlight',
 'react?lang=__react',
 'toc?maxDepth=2&keepElem',
 'description'
];

exports.getPlugins = moduleName => resolvePlugins(plugins, moduleName);
exports.getTransformers = () => ({
  test: /\.md$/,
  use: path.join(__dirname, '..', 'transformers', 'markdown')
});
