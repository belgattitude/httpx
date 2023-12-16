/**
 * Specific eslint rules for this workspace, learn how to compose
 * @link https://github.com/belgattitude/perso/tree/main/packages/eslint-config-bases
 */

// Workaround for https://github.com/eslint/eslint/issues/3458
// eslint-disable-next-line import/no-unassigned-import
require('@belgattitude/eslint-config-bases/patch/modern-module-resolution');

const {
  getDefaultIgnorePatterns,
} = require('@belgattitude/eslint-config-bases/helpers');

module.exports = {
  extends: [
    '@belgattitude/eslint-config-bases/typescript',
    '@belgattitude/eslint-config-bases/simple-import-sort',
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
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.test.ts',
              '**/*.spec.ts',
              '**/*.config.js',
              '**/*.config.mjs',
              '**/*.config.cjs',
              '**/*.config.ts',
              '**/*.d.ts',
              '.eslint*.*',
            ],
            optionalDependencies: false,
            peerDependencies: false,
          },
        ],
        'import/no-cycle': [1, { maxDepth: 100 }],
        'import/no-nodejs-modules': 'error',
        'import/no-self-import': 'error',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  root: true,
  rules: {
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
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
