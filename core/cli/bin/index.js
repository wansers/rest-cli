#!/usr/bin/env node

'use strict';

const importLocal = require("import-local");
const log = require("@rest-cli/log")

if (importLocal(__filename)) {
  log.info('cli', 'using local version of rest-cli');
} else {
  require("../lib")(process.argv.slice(2));
}
