/* eslint-disable import-x/no-nodejs-modules */
import { createHash } from 'node:crypto';

/**
 * Generate MD5 hash of a string using Node.js crypto module
 *
 * This implementation uses Node's native crypto module which:
 * - Properly handles UTF-8 encoding (consistent with other MD5 libraries)
 * - Is significantly faster than pure JavaScript implementations
 * - Is the standard way to compute hashes in Node.js environments
 *
 * @param text - The string to hash
 * @returns The MD5 hash as a hexadecimal string
 *
 * @example
 * ```ts
 * md5('hello'); // '5d41402abc4b2a76b9719d911017c592'
 * md5('Hello 世界'); // 'af91c2603879085df0cb545dd0366dcd'
 * ```
 */
export function md5Nodejs(text: string): string {
  return createHash('md5').update(text, 'utf8').digest('hex');
}
