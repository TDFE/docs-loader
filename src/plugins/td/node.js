/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 14:37:40
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 14:37:44
 */

const path = require('path');
const processDoc = require('./process-doc');
const processDemo = require('./process-demo');

module.exports = (markdownData, { noPreview, babelConfig }, isBuild) => {
 const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
 if (isDemo) {
   return processDemo(markdownData, isBuild, noPreview, babelConfig);
 }
 return processDoc(markdownData);
};
