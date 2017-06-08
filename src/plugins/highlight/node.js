/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 10:47:02
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 10:47:03
 */

import Prism from 'node-prismjs';
import JsonML from 'jsonml.js/lib/utils';

function getCode(node) {
 return JsonML.getChildren(
   JsonML.getChildren(node)[0] || '',
 )[0] || '';
}

function highlight(node) {
 if (!JsonML.isElement(node)) return;

 if (JsonML.getTagName(node) !== 'pre') {
   JsonML.getChildren(node).forEach(highlight);
   return;
 }

 const language = Prism.languages[JsonML.getAttributes(node).lang] ||
         Prism.languages.autoit;
 JsonML.getAttributes(node).highlighted =
   Prism.highlight(getCode(node), language);
}

module.exports = (markdownData) => {
 highlight(markdownData.content);
 return markdownData;
};
