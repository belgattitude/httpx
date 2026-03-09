/* eslint-disable import-x/no-nodejs-modules */
import { createHash } from 'node:crypto';

/**
 * Create a MD5 hash of a string.
 *
 * @example
 * ```typescript
 * import { md5 } from '@httpx/md5';
 *
 * const hash = md5('Hello: 🌍🚀✨🦄');
 *
 * // Hexadecimal RFC1321 / NodeJs string
 * // '8f11a08695d43b4f737a9706dffbf208'
 * ```
 *
 * @returns The MD5 hash of the input string as a hexadecimal string.
 * @throws TypeError if the input is not a string
 */
export function md5(text: string): string {
  if (typeof text != 'string') {
    throw new TypeError('Expected a string');
  }
  return createHash('md5').update(text, 'utf8').digest('hex');
}
