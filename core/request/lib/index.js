'use strict';

const axios = require('axios');
function request(url, options) {
    const res = axios.request({
      url: url,
      method: options.method,
      timeout: 500,
    })
}

module.exports = request;
