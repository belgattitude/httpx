import { bench, describe } from 'vitest';

import { getXXHashWasmInstance, XXHash64 } from '../../src/xxhash-wasm';
import { benchOptions } from '../bench-options';

const seeds = {
  smallStrings: Array.from({ length: 4 }).map((_, i) => `string${i}`.repeat(4)),
};

describe(`xxHash64`, async () => {
  const xxHashWasm = await getXXHashWasmInstance();
  const xxhash64 = new XXHash64(xxHashWasm);
  bench(
    `toBigint`,
    () => {
      seeds.smallStrings.forEach((v) => {
        xxhash64.toBigint(v);
      });
    },
    benchOptions
  );
  bench(
    `toSigned64`,
    () => {
      seeds.smallStrings.forEach((v) => {
        xxhash64.toSigned64(v);
      });
    },
    benchOptions
  );
});
