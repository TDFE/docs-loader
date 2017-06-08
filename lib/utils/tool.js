'use strict';

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 09:57:06
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 09:57:09
 */

var defaultPresets = ['es2015-ie', 'react', 'stage-2'];
var defaultPlugins = ['transform-decorators-legacy', 'transform-class-properties', 'transform-runtime', 'lodash'];

var babel = {
  cacheDirectory: true,
  babelrc: false,
  presets: defaultPresets,
  plugins: defaultPlugins
};

exports.getTransformers = function () {
  return {
    test: /\.md$/,
    use: [{
      loader: 'babel-loader',
      query: babel
    }, 'markdown-it-react-loader']
  };
};
//# sourceMappingURL=tool.js.map