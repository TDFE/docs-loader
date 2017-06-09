/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 13:40:22
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 13:40:34
 */

import R from 'ramda';
import path from 'path';
import resolve from 'resolve';
import loaderUtils from 'loader-utils';
import { escapeWinPath } from './escape-win-path';

function resolvePlugin(plugin) {
  let result = void 0;
  try {
    result = resolve.sync(plugin, { basedir: path.resolve(__dirname, '../plugins') });
  } catch(e) {}
  return result;
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
