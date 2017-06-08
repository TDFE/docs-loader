'use strict';

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var executorsCount = _os2.default.cpus().length - 1; /**
                                                      * @Author: Zhengfeng.Yao <yzf>
                                                      * @Date:   2017-06-07 17:37:42
                                                      * @Last modified by:   yzf
                                                      * @Last modified time: 2017-06-07 17:37:50
                                                      */

function createExecutors(count) {
  var executors = [];
  while (executors.length < count) {
    var executor = _child_process2.default.fork(_path2.default.join(__dirname, './executor.js'), [], { execArgv: ['--debug-brk'] });
    executor.setMaxListeners(1);
    executors.push(executor);
  }
  return executors;
}

module.exports = function () {
  var executors = createExecutors(executorsCount);
  var tasksQueue = [];
  function launch(task) {
    var executor = executors.pop();
    var callback = task.callback();
    executor.send(task);
    executor.once('message', function (result) {
      callback(null, result);
      executors.push(executor); // 任务完成
      if (tasksQueue.length > 0) {
        launch(tasksQueue.pop());
      }
    });
  }

  return {
    queue: function queue(task) {
      if (executors.length <= 0) {
        tasksQueue.push(task);
        return;
      }
      launch(task);
    },
    jobDone: function jobDone() {
      return executors.forEach(function (executor) {
        return executor.kill();
      });
    }
  };
};
//# sourceMappingURL=scheduler.js.map