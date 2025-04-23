// eslint-disable-next-line import-x/no-nodejs-modules,no-restricted-imports,unicorn/prefer-node-protocol
// import { Buffer } from 'node:buffer';

import type { Base64Encoder } from './base64.types';

export const Base64NodeJs = {
  encode: (input: string): string =>
    // eslint-disable-next-line no-restricted-globals
    Buffer.from(input, 'utf8').toString('base64'),

  decode: (input: string): string => {
    // eslint-disable-next-line no-restricted-globals
    return Buffer.from(input, 'base64').toString('utf8');
  },
} as const satisfies Base64Encoder;
