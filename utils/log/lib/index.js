'use strict';

const log = require("npmlog");
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; // 判断日志等级
log.heading = 'rest-cli'; // 修改日志前缀
log.addLevel('success', 2000, { fg: 'green', bold: true }); // 自定义日志

module.exports = log;
