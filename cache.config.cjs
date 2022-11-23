/**
 * Convenience script to harmonize cache directories across various
 * tooling such as eslint and jest.
 *
 * Recently more & more tools like babel-loader tend to cache in
 * node_modules/.cache (@link https://github.com/avajs/find-cache-dir)
 * It's possible too, but keeping a cache folder at the root simplifies
 * the cache management on CI
 */
// @ts-check
'use strict';

const { resolve } = require('path');

const globalCachePath = resolve(`${__dirname}/.cache`);

/**
 * @param {string} packageName
 * @returns string
 */
function sanitize(packageName) {
  return packageName.replace('/', '.').replace(/[^a-z0-9.@_-]+/gi, '-');
}

/**
 * @param {string} packageName
 * @returns string
 */
function getEslintCachePath(packageName) {
  return `${globalCachePath}/eslint/${sanitize(packageName)}`;
}

/**
 * @param {string} packageName
 * @returns string
 */
function getPrettierCachePath(packageName) {
  return `${globalCachePath}/prettier/${sanitize(packageName)}`;
}

module.exports = {
  getPrettierCachePath,
  getEslintCachePath,
  globalCachePath,
};
