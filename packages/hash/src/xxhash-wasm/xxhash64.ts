import type { XXHashAPI } from 'xxhash-wasm';

import {
  bigintToSignedInt64,
  type SignedInt64,
} from '../utils/bigint-to-signed-int64';

type XXHash64Options = { defaultSeed?: bigint };

export class XXHash64 {
  #h64: XXHashAPI['h64'];
  readonly options: XXHash64Options = {};
  constructor(h64: XXHashAPI['h64'], options?: XXHash64Options) {
    this.#h64 = h64;
    this.options = options ?? {};
  }
  toBigint = (input: string, seed?: bigint): bigint => {
    return this.#h64(input, seed ?? this.options.defaultSeed);
  };
  toSigned64 = (input: string, seed?: bigint): SignedInt64 => {
    return bigintToSignedInt64(
      this.#h64(input, seed ?? this.options.defaultSeed)
    );
  };
}
