'use strict';

const semver = require('semver');
const colors = require('colors/safe');
const log = require('@rest-cli/log')

const LOWEST_NODE_VERSION = 'v14.13.0';

class Command {
  constructor(argv) {
    if (!argv || argv?.length < 0) {
      throw new Error('参数不能为空');
    }
    let runner= new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs(argv));
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch(e => {
        log.error(e.message);
      })
    })
  }

  initArgs(argv) {
    this._cmd = argv[argv.length - 1]
    this._argv = argv.slice(0, argv.length - 1);
  }

  checkNodeVersion() {
    // 获取Node版本号
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    // 比对最低版本号
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`rest-cli need node version > ${lowestVersion}, but get ${currentVersion}`));
    }
  }

  init() {
    throw new Error('init必须实现');
  }

  exec() {

  }
}
module.exports = Command;
