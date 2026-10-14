// @ts-check

/**
 * This files overrides the base lint-staged.config.js present in the root directory.
 * It runs the oxlint / oxfmt versions pinned by @httpx/dx.
 * {@link https://github.com/okonet/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo}
 */

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "**/*.{js,jsx,mjs,cjs,ts,tsx}": ["dx-oxlint --fix", "dx-oxfmt --write"],
  "**/*.{json,md,mdx,css,html,yml,yaml,scss}": [
    "dx-oxfmt --write --no-error-on-unmatched-pattern",
  ],
};
