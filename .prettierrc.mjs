// @ts-check

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    getPrettierConfig,
} = require('@belgattitude/eslint-config-bases/helpers');

const { overrides = [], ...prettierConfig } = getPrettierConfig();

/**
 * @type {import('prettier').Config}
 */
export default {
    ...prettierConfig,
    overrides: [
        ...overrides,
        ...[
            {
                files: '*.md',
                options: {
                    singleQuote: false,
                    quoteProps: 'preserve',
                },
            },
        ],
    ],
};
