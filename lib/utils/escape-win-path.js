'use strict';

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 16:10:54
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 16:10:55
 */

function escapeWinPath(path) {
  return path.replace(/\\/g, '\\\\');
}

function toUriPath(path) {
  return path.replace(/\\/g, '/');
}

module.exports = {
  escapeWinPath: escapeWinPath,
  toUriPath: toUriPath
};
//# sourceMappingURL=escape-win-path.js.map