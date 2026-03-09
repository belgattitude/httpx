import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';
import { md5 as httpxMd5PureJs } from '@httpx/md5/ecmascript';
import { md5 as httpxMd5NativeNodeJs } from '@httpx/md5/nodejs';
import { md5 as npmHashWasmMd5 } from 'hash-wasm';
import { default as NpmMd5 } from 'md5';
import { default as NpmSparkMd5 } from 'spark-md5';
import { bench, describe } from 'vitest';
const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

const npmSparkMd5 = NpmSparkMd5;
const npmMd5 = NpmMd5;

const benchOptions = {
  warmupIterations: 1,
  iterations: isCiOrCodSpeed ? 1 : 1,
};

const totalStrings = isCiOrCodSpeed ? 1000 : 10_000;

const seeds = Array.from({ length: totalStrings }).map((_, i) => {
  return `seed-3. abcdefghij999-${i}`.repeat(30);
});

describe(`@httpx/md5 compared`, async () => {
  const hashLength = seeds[0]!.length;
  const text = `${hashLength} ascii chars x ${totalStrings}`;
  bench(
    `httpx/md5     - ${text} - nodejs`,
    () => {
      seeds.forEach((text) => httpxMd5NativeNodeJs(text));
    },
    benchOptions
  );
  bench(
    `httpx/md5     - ${text} - purejs`,
    () => {
      seeds.forEach((text) => httpxMd5PureJs(text));
    },
    benchOptions
  );

  bench(
    `npm:md5       - ${text}`,
    () => {
      seeds.forEach((text) => npmMd5(text));
    },
    benchOptions
  );
  bench(
    `npm:spark-md5 - ${text}`,
    () => {
      seeds.forEach((text) => npmSparkMd5.hash(text));
    },
    benchOptions
  );
  bench(
    `npm:hash-wasm - ${text}`,
    async () => {
      seeds.forEach(async (text) => await npmHashWasmMd5(text));
    },
    benchOptions
  );
});
