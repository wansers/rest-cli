'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const log = require('@rest-cli/log');
const { spinnerTask } = require('@rest-cli/utils');
const Command = require('@rest-cli/command');
const Package = require('@rest-cli/package');
const semver = require('semver');
const path = require('path');

const getTemplates = require('./getTemplates');

const TEMPLATE_TYPE_PROJECT = 1;
const TEMPLATE_TYPE_COMPONENTS = 2;

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0];
    this.force = this._argv[1]?.force;
    log.verbose('projectName:', this.projectName);
  }

  async exec() {
    await this.prepare();
    if (this.template) {
      await this.downloadTemplate();
    }
  }

  async prepare() {
    this.template = await spinnerTask('getTemplates', getTemplates);
    const cwd = process.cwd();
    if (!this.isDirEmpty(cwd)) {
      const { isDelete } = await inquirer
        .prompt([{
          type: 'confirm',
          name: 'isDelete',
          message: '所在目录不为空，是否继续创建？',
          default: false,
        }])
      if (!isDelete) {
        return;
      }
    }

    const projectInfo = await this.getProjectInfo();
    log.verbose('projectName:', projectInfo.projectName);
    log.verbose('projectVersion:', projectInfo.projectVersion);
  }

  async downloadTemplate() {
    let storeDir;
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    targetPath = path.resolve(homePath, 'template');
    storeDir = path.resolve(targetPath, 'node_modules');

    const pkg = new Package({
      packageName: '@rest-cli/init',
      packageVersion: 'latest',
      storeDir,
      targetPath,
    });

    if (pkg.exists()) {
      await pkg.update();
    } else {
      await pkg.install();
    }
  }

  async getProjectInfo() {
    const { type, projectName, projectVersion } = await inquirer
      .prompt([{
        type: 'list',
        name: 'type',
        message: '请选择模版类型',
        default: false,
        choices: [{
          value: TEMPLATE_TYPE_PROJECT,
          name: '项目',
        }, {
          value: TEMPLATE_TYPE_COMPONENTS,
          name: '组件',
        }]
      }, {
        type: 'input',
        name: 'projectName',
        message: '请输入你的项目名称',
      }, {
        type: 'input',
        name: 'projectVersion',
        default: '1.0.0',
        message: '请输入你的项目版本',
        validate: function (v) {
          // Declare function as asynchronous, and save the done callback
          const done = this.async();

          // Do async stuff
          setTimeout(function() {
            if (!semver.valid(v)) {
              // Pass the return value in the done callback
              done('请输入正确的版本号');
              return;
            }
            done(null, true);
          }, 3000);
        },
        filter: (v) => {
          if (!!v) {
            return semver.valid(v);
          }
          return v;
        }
      }])

    return {
      type,
      projectName,
      projectVersion,
    }
  }

  isDirEmpty(path) {
    const fileList = fs.readdirSync(path)
    if (!(fileList && fileList.length > 0)) {
      return true
    }
    return false;
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
