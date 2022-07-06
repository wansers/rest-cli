const request = require('@rest-cli/request');
module.exports = function () {
  return request({
    url: '/getTemplates',
    method: 'GET'
  })
}
