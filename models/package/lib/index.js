'use strict';

const pkgDir = require('pkg-dir').sync;
const path = require('path');
const pathExists = require('path-exists').sync;
const npminstall = require('npminstall');
const { isObject } = require('@rest-cli/utils');
const formatePath = require('@rest-cli/format-path');
const { getDefaultRegistry, getNpmLatestVersion } = require('@rest-cli/get-npm-info');

class Package {
  constructor(options) {
    if (!options || !isObject(options)) {
      throw new Error('Package类的options参数不能为空')
    }
    this.targetPath = options.targetPath;
    this.storeDir = options.storeDir;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  async prepare() {
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName, getDefaultRegistry());
    }
  }

  async exists() {
    if (this.storeDir) {
      await this.prepare();
      return pathExists(this.getCacheFilePathByVersion(this.packageVersion));
    } else {
      return pathExists(this.targetPath)
    }
    return false;
  }

  async install() {
    await npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion
        },
      ]
    })
  }

  async update() {
    const latestNpmVersion = await getNpmLatestVersion(this.packageName);
    const latestFilePath = this.getCacheFilePathByVersion(latestNpmVersion);
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [
          {
            name: this.packageName,
            version: latestNpmVersion
          },
        ]
      })
      this.packageVersion = latestNpmVersion;
    }

  }

  getCacheFilePathByVersion(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`)
  }

  getRootFilePath() {
    function _getRootFilePath(targetPath) {
      const dir = pkgDir(targetPath);

      if (dir) {
        const pkg = require(path.resolve(dir, 'package.json'));
        if (pkg && pkg.main) {
          return formatePath(path.resolve(dir, pkg.main));
        }
      }
      return null;
    }

    if (this.storeDir) {
      return _getRootFilePath(this.getCacheFilePathByVersion(this.packageVersion))
    } else {
      return _getRootFilePath(this.targetPath)
    }
  }
}

module.exports = Package;
