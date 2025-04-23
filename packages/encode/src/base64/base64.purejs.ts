import { globalCache } from '../cache/global-cache';
import type { Base64Encoder } from './base64.types';
import { base64Alphabet } from './base64-alphabet';

export const Base64Purejs = {
  encode: (input: string): string => {
    const bytes = globalCache.utf8TextEncoder.encode(input);
    const length = bytes.length;
    let result = '';

    for (let i = 0; i < length; i += 3) {
      const chunk =
        (bytes[i]! << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);

      result += base64Alphabet[(chunk >> 18) & 0x3f];
      result += base64Alphabet[(chunk >> 12) & 0x3f];
      result += i + 1 < length ? base64Alphabet[(chunk >> 6) & 0x3f] : '=';
      result += i + 2 < length ? base64Alphabet[chunk & 0x3f] : '=';
    }

    return result;
  },

  decode: (input: string): string => {
    // eslint-disable-next-line no-restricted-globals
    return Buffer.from(input, 'base64').toString('utf8');
  },
} as const satisfies Base64Encoder;
