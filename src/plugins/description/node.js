/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 11:58:16
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 11:58:17
 */

import JsonML from 'jsonml.js/lib/utils';

module.exports = (markdownData) => {
  const content = markdownData.content;
  const contentChildren = JsonML.getChildren(content);
  const dividerIndex = contentChildren.findIndex((node) => JsonML.getTagName(node) === 'hr');

  if (dividerIndex >= 0) {
   markdownData.description = ['section']
     .concat(contentChildren.slice(0, dividerIndex));
   markdownData.content = [
     JsonML.getTagName(content),
     JsonML.getAttributes(content) || {},
   ].concat(contentChildren.slice(dividerIndex + 1));
  }

  return markdownData;
};
