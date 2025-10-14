import { bench, describe } from 'vitest';

import { createXXHash64 } from '../../src/xxhash-wasm';
import { benchOptions } from '../bench-options';

const seeds = {
  smallStrings: Array.from({ length: 4 }).map((_, i) => `string${i}`.repeat(4)),
};

describe(`xxHash64`, async () => {
  const xxhash64 = await createXXHash64();
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
