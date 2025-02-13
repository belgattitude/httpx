import { createStableHashOrThrow } from './create-stable-hash-or-throw';
import type { CreateStableHashOptions, SupportedDataTypesRW } from './types';

type Result =
  | { success: true; hash: string }
  | { success: false; error: Error };

/**
 * Create a stable sha-256/hexadecimal hash from a value. Useful for caching
 * or memoization.
 *
 * Object keys are sorted to maintain equality between objects with
 * the same keys but in different order.
 *
 * @example
 * ```typescript
 * import { createStableHash } from '@httpx/stable-hash';
 *
 * const value = {
 *   key8: 'a string',
 *   key1: 1,
 *   key3: true,
 *   key2: [3, 2, 1],
 *   key7: {
 *     key2: true,
 *     key1: new Date('2025-02-11T08:58:32.075Z'),
 *   },
 * };
 *
 * const result = await createStableHash(value, {
 *   // By default SHA-256 is used (SHA-512 available)
 *   algorithm: 'SHA-256',
 *   // By default the hash is encoded in hexadecimal
 *   encoding: 'hexa',
 * });
 * if (!result.success) {
 *   throw result.error;
 * }
 * const hash = result.hash;
 * // -> 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
 * ```
 */
export const createStableHash = async <T extends SupportedDataTypesRW>(
  value: T,
  options?: CreateStableHashOptions
): Promise<Result> => {
  try {
    const hash = await createStableHashOrThrow(value, options);
    return {
      success: true,
      hash,
    };
  } catch (e) {
    return { success: false, error: e as TypeError };
  }
};
