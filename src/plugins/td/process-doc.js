/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-12 16:35:45
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-12 16:35:46
 */

const JsonML = require('jsonml.js/lib/utils');

module.exports = (markdownData) => {
 const contentChildren = JsonML.getChildren(markdownData.content);
 const apiStartIndex = contentChildren.findIndex(node =>
    JsonML.getTagName(node) === 'h2' &&
     /^API/.test(JsonML.getChildren(node)[0])
 );

 if (apiStartIndex > -1) {
   const content = contentChildren.slice(0, apiStartIndex);
   markdownData.content = ['section'].concat(content);

   const api = contentChildren.slice(apiStartIndex);
   markdownData.api = ['section'].concat(api);
 }

 return markdownData;
};
