/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-12 16:34:36
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-12 16:34:38
 */

import path from 'path';
import processDoc from './process-doc';
import processDemo from './process-demo';

module.exports = (markdownData, { noPreview, babelConfig }) => {
  const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (isDemo) {
    return processDemo(markdownData, noPreview, babelConfig);
  }
  return processDoc(markdownData);
};
