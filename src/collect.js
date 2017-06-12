/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-12 09:51:31
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-12 09:51:32
 */

module.exports = collector => Component => {
  Component.collector = collector;
  return Component;
};
