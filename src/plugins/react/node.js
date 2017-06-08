/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 10:50:46
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 10:50:48
 */

import transformer from './transformer';

module.exports = function(markdownData, {
  lang = 'react-example',
  babelConfig,
  noreact,
}) {
  const { content } = markdownData;

  if (Array.isArray(content)) {
    markdownData.content = content.map(node => {
      const tagName = node[0];
      const attr = node[1];
      if (tagName === 'pre' && attr && attr.lang === lang) {
        const code = node[2][1];
        const processedCode = transformer(code, babelConfig, noreact);
        return {
          EMBEDED_CODE: true,
          code: processedCode,
        };
      }
      return node;
    });
  }

  return markdownData;
};
