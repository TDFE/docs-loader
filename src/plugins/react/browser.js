/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 11:36:47
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 11:36:48
 */

import React from 'react';

module.exports = function() {
  return {
    converters: [
      [
        function(node) { return typeof node === 'function'; },
        function(node, index) {
          return React.cloneElement(node(), { key: index });
        },
      ],
    ],
  };
};
