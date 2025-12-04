// @ts-check

/**
 * This files overrides the base lint-staged.config.js present in the root directory.
 * It allows to run eslint based the package specific requirements.
 * {@link https://github.com/okonet/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo}
 * {@link https://github.com/belgattitude/nextjs-monorepo-example/blob/main/docs/about-lint-staged.md}
 */

import path from 'node:path';
import url from 'node:url';

import {
    concatFilesForPrettier,
    getEslintFixCmd,
} from '../../lint-staged.common.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
    '**/*.{js,jsx,ts,tsx}': (filenames) => {
        return getEslintFixCmd({
            cache: true,
            cwd: __dirname,
            files: filenames,
            fix: true,
            maxWarnings: 25,
        });
    },
    '**/*.{json,md,mdx,css,html,yml,yaml,scss}': (filenames) => {
        return [`prettier --write ${concatFilesForPrettier(filenames)}`];
    },
};
