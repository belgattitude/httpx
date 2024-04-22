/**
 * Specific eslint rules for this workspace, learn how to compose
 * @link https://github.com/belgattitude/perso/tree/main/packages/eslint-config-bases
 */

require('@belgattitude/eslint-config-bases/patch/modern-module-resolution');

const {
  getDefaultIgnorePatterns,
} = require('@belgattitude/eslint-config-bases/helpers');

module.exports = {
  extends: [
    '@belgattitude/eslint-config-bases/typescript',
    '@belgattitude/eslint-config-bases/simple-import-sort',
    '@belgattitude/eslint-config-bases/import-x',
    '@belgattitude/eslint-config-bases/sonar',
    '@belgattitude/eslint-config-bases/regexp',
    '@belgattitude/eslint-config-bases/jest',
    '@belgattitude/eslint-config-bases/performance',
    // Apply prettier and disable incompatible rules
    '@belgattitude/eslint-config-bases/prettier-plugin',
  ],
  ignorePatterns: [
    ...getDefaultIgnorePatterns(),
    '**/build',
    '**/.cache',
    '**/dist',
    '**/_release',
    '.cache',
    '**/docs',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    'jest/no-restricted-matchers': [
      'error',
      {
        toBeFalsy: null,
        resolves: 'Use `expect(await promise)` instead.',
        toHaveBeenCalledWith: null,
        'not.toHaveBeenCalledWith': null,
        'resolves.toHaveBeenCalledWith': null,
        'rejects.toHaveBeenCalledWith': null,
        'resolves.not.toHaveBeenCalledWith': null,
        'rejects.not.toHaveBeenCalledWith': null,
      },
    ],
  },
};
