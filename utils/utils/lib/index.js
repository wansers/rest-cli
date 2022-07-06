'use strict';

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

async function spinnerTask(text, func) {
    const ora = require('ora');
    const spinner = ora(text).start();
    try {
        const ret = await func();
        spinner.succeed(`${text} succeed`);
        return ret;
    } catch (e) {
        spinner.fail(`${text} fail`);
        throw new Error(e.message);
    }
}

module.exports = { isObject, spinnerTask };
