import prettyBytes from "pretty-bytes";
import { SuperJSON } from "superjson";
import { describe, test } from "vitest";

import { CacheCompress, type ICacheSerializer } from "../src";
import type { CacheCompressResult } from "../src/compress/types";
import { benchConfig } from "./bench-config";
import { generateArrayOfDataWithSharedRefs } from "./data-generator";

const options = benchConfig.benchOptions;
const { rows } = benchConfig;

const createSuperjsonSerializer = (dedupe: boolean): ICacheSerializer => {
  const superjson = new SuperJSON({ dedupe });
  const identifier = dedupe ? "superjson-dedupe" : "superjson";
  return {
    getIdentifier: () => identifier,
    serialize: (data) => superjson.stringify(data),
    deserialize: (serializedData) => superjson.parse(serializedData),
    toString: () => identifier,
  };
};

const data = generateArrayOfDataWithSharedRefs(rows);

const cases = await Promise.all(
  [false, true].map(async (dedupe) => {
    const serializer = createSuperjsonSerializer(dedupe);
    const compressor = new CacheCompress({
      serializer,
      algorithm: "gzip",
      // Always compress to compare apples to apples
      minimumRatio: 0,
      minimumByteSaving: 0,
    });
    const compressed = await compressor.compress(data);
    if (compressed.status !== "success") {
      throw new Error(
        `Compression with ${serializer.getIdentifier()} did not succeed`
      );
    }
    const sizes = `${prettyBytes(compressed.meta.originalSize)} -> ${prettyBytes(compressed.meta.compressedSize)}`;
    return {
      label: serializer.getIdentifier(),
      compressor,
      compressed: compressed as CacheCompressResult,
      sizes,
    };
  })
);

describe("Superjson with/without dedupe compressed in gzip", () => {
  test("compress (serialize + gzip)", async ({ bench }) => {
    await bench.compare(
      ...cases.map(({ label, compressor, sizes }) =>
        bench(`${label}.compress(${sizes})`, async () => {
          const _data = await compressor.compress(data);
        })
      ),
      options
    );
  });

  test("decompress (gunzip + deserialize)", async ({ bench }) => {
    await bench.compare(
      ...cases.map(({ label, compressor, compressed, sizes }) =>
        bench(`${label}.decompress(${sizes})`, async () => {
          const _data = await compressor.decompress(compressed);
        })
      ),
      options
    );
  });
});
