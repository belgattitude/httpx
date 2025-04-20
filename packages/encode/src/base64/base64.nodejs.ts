// eslint-disable-next-line import-x/no-nodejs-modules,no-restricted-imports
import { Buffer } from 'node:buffer';

import type { Base64Encoder } from './base64.types';

export const Base64Node = {
  encode: (input: string): string =>
    Buffer.from(input, 'utf8').toString('base64'),

  decode: (input: string): string => {
    return Buffer.from(input, 'base64').toString('utf8');
  },
} as const satisfies Base64Encoder;
