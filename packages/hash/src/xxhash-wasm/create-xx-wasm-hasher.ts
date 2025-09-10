import type { XXHash64Options } from '../types/xxhash.type';
import { getXXHashWasmInstance } from './get-xxhash-wasm-instance';
import { XXHash64 } from './xxhash64';

/**
 * Create a configured instance of `XXHash64` hasher.
 *
 * ```typescript
 * import { createXXWasmHasher } from '@httpx/hash/xxhash-wasm';
 * export const xxHasher = await createXXWasmHasher({
 *   defaultSeed: 0n, // optional
 * });
 * ```
 */
export const createXXWasmHasher = async (options?: XXHash64Options) => {
  const xxHashWasm = await getXXHashWasmInstance();
  return new XXHash64(xxHashWasm, options);
};
