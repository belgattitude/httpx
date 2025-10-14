import type { XXHash64Options } from '../types/xxhash.type';
import { getXXHashAPI } from './get-xxhash-api';
import { XXHash64 } from './xxhash64';

/**
 * Helper function to initialize an instance of the `XXHash64` wasm hasher.
 *
 * Under the hood, it uses a singleton pattern to ensure that the `xxhash-wasm`
 * module is only initialized once.
 *
 * Note that this function is async as the wasm module loading is asynchronous.
 *
 * ```typescript
 * import { createXXHash64 } from '@httpx/hash/xxhash-wasm';
 *
 * // Notice the await as wasm loading is async.
 * const xxHash64 = await createXXWasmHasher({
 *   // options are optional
 *   defaultSeed: 0n,
 * });
 *
 * // Javascript Bigint output as 64-bit unsigned integer
 * const hashedBigint = xxHash64.toBigint('some input string');
 *
 * // Javascript Bigint output as 64-bit signed integer
 * const hashedSigned64 = xxHash64.toSigned64('some input string');
 * ```
 */
export const createXXHash64 = async (
  options?: XXHash64Options
): Promise<XXHash64> => {
  const xxHashWasm = await getXXHashAPI();
  return new XXHash64(xxHashWasm, options);
};
