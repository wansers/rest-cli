#!/usr/bin/env node
'use strict';
module.exports = main;

const path = require('path');
const userHome = require('user-home');
const commander = require('commander');
const pathExists = require('path-exists').sync;
const semver = require('semver');
const colors = require('colors/safe');
const log = require("@rest-cli/log");
const init = require('@rest-cli/init');
const exec = require('@rest-cli/exec');

const constant = require('./constant');
const pkg = require('../package.json');

let config;

const program = new commander.Command();

async function main(argv) {
  await prepare();
  registerCommand();
}

async function prepare() {
  try {
    checkRoot();
    checkPkgVersion();
    checkNodeVersion();
    checkUserHome();
    checkEnv();
    await checkGlobalUpdate();
  } catch (e) {
    log.error(e.message);
  }
}

function registerCommand() {
  program
    .name('rest-li')
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '本地执行文件地址', '')

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目', false)
    .action(exec)

  program.on('option:debug', function () {
    const options = program.opts();
    if (options.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  })

  program.on('option:targetPath', function () {
    const options = program.opts();
    process.env.CLI_TARGET_PATH = options.targetPath;
  })

  program.on('command:*', function(obj) {
    const availabelCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知命令：' + obj[0]));
    console.log(colors.red('可用命令：' + availabelCommands.join(',')));
  })

  if (process.argv.length < 3) {
    program.outputHelp();
  } else {
    program.parse(process.argv);
  }
}

async function checkGlobalUpdate() {
  // 获取最新版本号
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 调用npm API
  const { getNpmSemverVersion } = require('@rest-cli/get-npm-info');
  const lastVersion = await getNpmSemverVersion(pkg.version, 'url-join');
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn('更新提示', colors.yellow(`请手动更新${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
      更新命令: npm install -g ${npmName}`))
  }
}

function checkEnv() {
  const dotenv = require('dotenv');
  const dotEnvPath = path.resolve(userHome, '.env');
  if (pathExists(dotEnvPath)) {
    config = dotenv.config({
      path: dotEnvPath,
    });
  }
  createDefaultConfig();
  log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  process.env.CLI_HOME_PATH = path.join(userHome, process.env.CLI_HOME || constant.CLI_HOME);
}

function checkPkgVersion() {
  log.notice('rest-cli', pkg.version);
}

function checkNodeVersion() {
  // 获取Node版本号
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  // 比对最低版本号
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`rest-cli need node version > ${lowestVersion}, but get ${currentVersion}`));
  }
}

function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('there no user-home'))
  }
}
