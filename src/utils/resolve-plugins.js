/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 13:40:22
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 13:40:34
 */

import fs from 'fs';
import R from 'ramda';
import path from 'path';
import loaderUtils from 'loader-utils';
import { escapeWinPath } from './escape-win-path';

function resolvePlugin(plugin) {
  const _path = path.resolve(__dirname, '../plugins', `${plugin}.js`);
  if (fs.existsSync(_path)) {
    return _path;
  }
}

module.exports = function resolvePlugins(plugins, moduleName) {
  return plugins.map(plugin => {
    const snippets = plugin.split('?');
    const pluginName = path.join(snippets[0], moduleName);
    const pluginQuery = loaderUtils.parseQuery(`?${snippets[1] || ''}`);
    const resolvedPlugin = resolvePlugin(pluginName);
    if (!resolvedPlugin) {
      return false;
    }
    return [escapeWinPath(resolvedPlugin), pluginQuery];
  }).filter(R.identity);
}
