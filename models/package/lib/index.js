'use strict';

const pkgDir = require('pkg-dir').sync;
const path = require('path');
const npminstall = require('npminstall');
const { isObject } = require('@rest-cli/utils');
const formatePath = require('@rest-cli/format-path');
const { getDefaultRegistry } = require('@rest-cli/get-npm-info');

class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类的options参数不能为空')
    }
    this.targetPath = options.targetPath;
    this.storePath = options.storePath;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
  }

  exists() {
    return false;
  }

  install() {
    npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion
        },
      ]
    })
  }

  update() {

  }

  getRootFilePath() {
    const dir = pkgDir(this.targetPath);
    if (dir) {
      const pkg = require(path.resolve(dir, 'package.json'));
      if (pkg && pkg.main) {
        return formatePath(path.resolve(dir, pkg.main));
      }
    }
    return null;
  }
}

module.exports = Package;
