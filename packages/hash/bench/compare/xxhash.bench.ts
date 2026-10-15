import { describe, test } from "vitest";

import { createXXHash64 } from "../../src/xxhash-wasm";
import { benchOptions } from "../bench-options";

const seeds = {
  smallStrings: Array.from({ length: 4 }).map((_, i) => `string${i}`.repeat(4)),
};

describe(`xxHash64`, () => {
  test(`xxHash64 conversions`, async ({ bench }) => {
    const xxhash64 = await createXXHash64();
    await bench.compare(
      bench(`toBigint`, () => {
        for (const v of seeds.smallStrings) {
          xxhash64.toBigint(v);
        }
      }),
      bench(`toSigned64`, () => {
        for (const v of seeds.smallStrings) {
          xxhash64.toSigned64(v);
        }
      }),
      benchOptions
    );
  });
});
