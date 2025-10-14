import type { XXHashAPI } from 'xxhash-wasm';

import type {
  XXHash64DefaultOptions,
  XXHash64Options,
} from '../types/xxhash.type';
import {
  bigintToSignedInt64,
  type SignedInt64,
} from '../utils/bigint-to-signed-int64';

/**
 * XXHash64 hasher using WebAssembly implementation from `xxhash-wasm`.
 *
 * ```typescript
 * import { createXXWasmHasher } from '@httpx/hash/xxhash-wasm';
 * export const xxWasm = await createXXWasmHasher({
 *   defaultSeed: 0n, // optional
 * });
 *
 * const hash = xxWasm.toBigint('some input string');
 * ```
 *
 * @see createXXHash64
 */
export class XXHash64 {
  #xxHash: XXHashAPI;
  readonly options: XXHash64DefaultOptions = {};
  constructor(xxHash: XXHashAPI, options?: XXHash64DefaultOptions) {
    this.#xxHash = xxHash;
    this.options = options ?? {};
  }

  /**
   * Return a 64-bit unsigned integer hash as a bigint using XXHash64 algorithm.
   */
  toBigint = (input: string, options?: XXHash64Options): bigint => {
    return this.#xxHash.h64(input, options?.seed ?? this.options.defaultSeed);
  };
  /**
   * Convert input string to signed 64-bit integer using XXHash64 algorithm.
   *
   * This accommodates some databases like mssql that do not support unsigned 64-bit integers.
   */
  toSigned64 = (input: string, options?: XXHash64Options): SignedInt64 => {
    return bigintToSignedInt64(this.toBigint(input, options));
  };
}
