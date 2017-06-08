/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 11:36:28
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 11:36:30
 */


import React from 'react';
import JsonML from 'jsonml.js/lib/utils';

module.exports = function () {
 return {
   converters: [
     [
       function (node) { return JsonML.isElement(node) && JsonML.getTagName(node) === 'pre'; },
       function (node, index) {
         var attr = JsonML.getAttributes(node);
         return React.createElement('pre', {
           key: index,
           className: `language-${attr.lang}`,
         }, React.createElement('code', {
           dangerouslySetInnerHTML: { __html: attr.highlighted },
         }));
       },
     ],
   ],
 };
};
