/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 18:16:38
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 18:33:14
 */

module.exports = function stringify(node, depth = 0) {
 const indent = '  '.repeat(depth);
 if (Array.isArray(node)) {
   return `[\n${
     node.map(item => `${indent}  ${stringify(item, depth + 1)}`).join(',\n')
     }\n${indent}]`;
 }
 if (
   typeof node === 'object' &&
     node !== null &&
     !(node instanceof Date)
 ) {
   if (node.EMBEDED_CODE) {
     return node.code;
   }
   return `{\n${
     Object.keys(node).map((key) => {
       const value = node[key];
       return `${indent}  "${key}": ${stringify(value, depth + 1)}`;
     }).join(',\n')
     }\n${indent}}`;
 }
 return JSON.stringify(node, null, 2);
};
