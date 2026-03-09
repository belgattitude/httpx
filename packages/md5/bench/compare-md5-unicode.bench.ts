import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';
import { md5 as httpxMd5PureJs } from '@httpx/md5/ecmascript';
import { md5 as httpxMd5NativeNodeJs } from '@httpx/md5/nodejs';
import { md5 as npmHashWasmMd5 } from 'hash-wasm';
import { default as NpmMd5 } from 'md5';
import { default as NpmSparkMd5 } from 'spark-md5';
import { bench, describe } from 'vitest';
const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

const isBun = 'Bun' in globalThis;

const npmSparkMd5 = NpmSparkMd5;
const npmMd5 = NpmMd5;

const benchOptions = {
  warmupIterations: 1,
  iterations: isCiOrCodSpeed ? 1 : 1,
};

const totalStrings = isCiOrCodSpeed ? 1000 : 10_000;

const seeds = Array.from({ length: totalStrings }).map((_, i) => {
  return `seed-4. Émojis: 🌍🚀✨-${i}`.repeat(30);
});

describe(`@httpx/md5 compared`, async () => {
  const hashLength = seeds[0]!.length;
  const text = `${hashLength} chars x ${totalStrings}`;
  bench(
    `httpx/md5     - ${text} - ${isBun ? 'bun' : 'nodejs'}`,
    () => {
      for (const seed of seeds) {
        httpxMd5NativeNodeJs(seed);
      }
    },
    benchOptions
  );
  bench(
    `httpx/md5     - ${text} - purejs`,
    () => {
      for (const seed of seeds) {
        httpxMd5PureJs(seed);
      }
    },
    benchOptions
  );

  bench(
    `npm:md5       - ${text}`,
    () => {
      for (const seed of seeds) {
        npmMd5(seed);
      }
    },
    benchOptions
  );
  bench(
    `npm:spark-md5 - ${text}`,
    () => {
      for (const seed of seeds) {
        npmSparkMd5.hash(seed);
      }
    },
    benchOptions
  );
  bench.skipIf(isBun)(
    `npm:hash-wasm - ${text}`,
    async () => {
      for (const seed of seeds) {
        await npmHashWasmMd5(seed);
      }
    },
    benchOptions
  );
});
