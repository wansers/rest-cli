'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }

  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios.get(npmInfoUrl).then(response => {
    if (response.status === 200) {
      return response.data;
    }
    return null
  }).catch(e => {
    return Promise.reject(e);
  })
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  }
  return [];
}

function getNpmSemverVersions(baseVsersion, versions) {
  return versions
    .filter(version => semver.satisfies(version, `^${baseVsersion}`))
    .sort((a, b) => semver.gt(b, a) ? 1 : -1);
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersion = getNpmSemverVersions(baseVersion, versions);

  if (newVersion?.length > 0) {
    return newVersion[0];
  }
  return null;
}

async function getNpmLatestVersion(npmName, registry) {
  let versions = await getNpmVersions(npmName, registry);
  return versions.sort((a, b) => (semver.gt(b, a)) ? 1 : -1)[0];
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmLatestVersion,
  getNpmSemverVersion,
  getDefaultRegistry,
};
