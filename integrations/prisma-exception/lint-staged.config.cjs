// @ts-check

/**
 * This files overrides the base lint-staged.config.js present in the root directory.
 * It allows to run eslint based the package specific requirements.
 * {@link https://github.com/okonet/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo}
 * {@link https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-lint-staged.md}
 */

const {
  concatFilesForPrettier,
  getEslintFixCmd,
} = require('../../lint-staged.common.cjs');

/**
 * @type {Record<string, (filenames: string[]) => string | string[] | Promise<string | string[]>>}
 */
const rules = {
  '**/*.{js,jsx,ts,tsx}': (filenames) => {
    return [
      getEslintFixCmd({
        cache: true,
        cwd: __dirname,
        files: filenames,
        // when autofixing staged-files a good tip is to disable react-hooks/exhaustive-deps, cause
        fix: true,
        maxWarnings: 25,
        // a change here can potentially break things without proper visibility.
        rules: ['react-hooks/exhaustive-deps: off'],
      }),
    ];
  },
  '**/*.{json,md,mdx,css,html,yml,yaml,scss}': (filenames) => {
    return [`prettier --write ${concatFilesForPrettier(filenames)}`];
  },
};

module.exports = rules;
