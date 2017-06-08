/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 09:57:06
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 09:57:09
 */

const defaultPresets = [
 'es2015-ie',
 'react',
 'stage-2',
];
const defaultPlugins = [
 'transform-decorators-legacy',
 'transform-class-properties',
 'transform-runtime',
 'lodash'
];

const babel = {
  cacheDirectory: true,
  babelrc: false,
  presets: defaultPresets,
  plugins: defaultPlugins
};

exports.getTransformers = () => ({
  test: /\.md$/,
  use: [{
    loader: 'babel-loader',
    query: babel
  }, 'markdown-it-react-loader']
});
