'use strict';

module.exports = exec;

const path = require('path');
const Package = require('@rest-cli/package');
const log = require('@rest-cli/log');

const SETTINGS = {
  init: '@imooc-cli-dev/core',
  // init: '@rest-cli/init',
};

const CACHE_DIR = 'dependencies/';

function exec() {
  let pkg;
  let storeDir;
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);

  const cmdObj = arguments[arguments.length - 1]
  const packageName = SETTINGS[cmdObj.name()];
  const packageVersion = 'latest';
  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion
    });

    if (pkg.exists()) {
      console.log('--------------');
    } else {
      console.log('=================');
      pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion
    });
  }

  const rootFile = pkg.getRootFilePath();
  require(rootFile).apply(null, arguments);
}
