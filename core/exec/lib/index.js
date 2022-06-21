'use strict';

module.exports = exec;

const Package = require('@rest-cli/package');
const log = require('@rest-cli/log');

const SETTINGS = {
  init: '@rest-cli/init',
};

const CACHE_DIR = 'dependencies/';

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);

  const cmdObj = arguments[arguments.length - 1]
  const packageName = SETTINGS[cmdObj.name()];
  const packageVersion = 'latest';
  if (!targetPath) {
    targetPath = '';
    const storeDir = '';
  }
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion
  });

  console.log('+++++++', pkg.getRootFilePath());
}
