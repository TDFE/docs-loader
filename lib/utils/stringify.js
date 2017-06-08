'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 18:16:38
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 18:33:14
 */

module.exports = function stringify(node) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var indent = '  '.repeat(depth);
  if (Array.isArray(node)) {
    return '[\n' + node.map(function (item) {
      return indent + '  ' + stringify(item, depth + 1);
    }).join(',\n') + '\n' + indent + ']';
  }
  if ((typeof node === 'undefined' ? 'undefined' : (0, _typeof3.default)(node)) === 'object' && node !== null && !(node instanceof Date)) {
    if (node.EMBEDED_CODE) {
      return node.code;
    }
    return '{\n' + (0, _keys2.default)(node).map(function (key) {
      var value = node[key];
      return indent + '  "' + key + '": ' + stringify(value, depth + 1);
    }).join(',\n') + '\n' + indent + '}';
  }
  return (0, _stringify2.default)(node, null, 2);
};
//# sourceMappingURL=stringify.js.map