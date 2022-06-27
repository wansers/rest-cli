'use strict';

const Command = require('@rest-cli/command');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0];
    this.force = this._argv[1]?.force;
    console.log('+++++++', this.projectName, this.force);
  }

  exec() {
    console.log('-------------exec');
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
