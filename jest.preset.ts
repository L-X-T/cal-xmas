const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  resolver: '@nrwl/jest/plugins/resolver',
  testEnvironment: 'jest-environment-jsdom'
};
