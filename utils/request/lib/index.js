'use strict';

const axios = require('axios');
const request = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  timeout: 5000,
})

request.interceptors.response.use(
  response => {
    return response.data || [];
  },
  error => {
    return Promise.reject(error);
  }
)

module.exports = request;
