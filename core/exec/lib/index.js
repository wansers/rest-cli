'use strict';

module.exports = exec;

const path = require('path');
const Package = require('@rest-cli/package');
const log = require('@rest-cli/log');
const cp = require('child_process');

const SETTINGS = {
  init: '@rest-cli/init',
};

const CACHE_DIR = 'dependencies/';

async function exec() {
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

    if (await pkg.exists()) {
      await pkg.update();
    } else {
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion
    });
  }

  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    try {
      const code = 'console(0)';
      const child = cp.spawn('noden', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });
      child.on('error', (e) => {
        log.error(e.message)
        process.exit(1);
      })
      // require(rootFile).call(null, Array.from(arguments));
    } catch (e) {
      log.error(e.message);
    }
  }
}
