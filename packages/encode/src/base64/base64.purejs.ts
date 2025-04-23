import { globalCache } from '../cache/global-cache';
import type { Base64Encoder } from './base64.types';
import { base64Alphabet, type Base64Character } from './base64-alphabet';

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
    // Remove padding characters
    const sanitizedInput = input.replace(/=+$/, '');
    const output: number[] = [];
    const lookup: Record<Base64Character, number> = {} as unknown as Record<
      Base64Character,
      number
    >;

    // Create a lookup table for Base64 characters
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < base64Alphabet.length; i++) {
      lookup[base64Alphabet[i] as Base64Character] = i;
    }

    for (let i = 0; i < sanitizedInput.length; i += 4) {
      const chunk =
        (lookup[sanitizedInput[i] as Base64Character] << 18) |
        (lookup[sanitizedInput[i + 1] as Base64Character] << 12) |
        ((lookup[sanitizedInput[i + 2] as Base64Character] ?? 0) << 6) |
        (lookup[sanitizedInput[i + 3] as Base64Character] ?? 0);

      output.push((chunk >> 16) & 0xff);
      if (sanitizedInput[i + 2] !== undefined) output.push((chunk >> 8) & 0xff);
      if (sanitizedInput[i + 3] !== undefined) output.push(chunk & 0xff);
    }

    // Convert the byte array to a string
    return new TextDecoder().decode(new Uint8Array(output));
  },
} as const satisfies Base64Encoder;
