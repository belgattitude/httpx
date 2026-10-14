// @ts-check

/**
 * This is the base lint-staged rules config and just includes oxfmt by default.
 * Packages override it with their own lint-staged.config.js to add oxlint.
 *
 * {@link https://github.com/okonet/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo}
 */

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "**/*.{json,md,mdx,css,html,yml,yaml,scss,ts,js,tsx,jsx,mjs,cjs}": [
    "dx-oxfmt --write --no-error-on-unmatched-pattern",
  ],
};
