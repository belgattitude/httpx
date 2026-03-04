import { md5 as httpxMd5PureJs } from '@httpx/md5/ecmascript';
import { md5 as httpxMd5NativeNodeJs } from '@httpx/md5/nodejs';
import { default as NpmMd5 } from 'md5';
import { default as NpmSparkMd5 } from 'spark-md5';
import { bench, describe } from 'vitest';

const npmSparkMd5 = NpmSparkMd5;
const npmMd5 = NpmMd5;

const benchOptions = {
  warmupIterations: 1,
  iterations: 1,
};

const seeds = Array.from({ length: 10_000 }).map((_, i) => {
  return `seed-4. Émojis: 🌍🚀✨-${i}`.repeat(1);
});

describe(`@httpx/md5 compared`, async () => {
  bench(
    `httpx/md5 (pure js)`,
    () => {
      seeds.forEach((text) => httpxMd5PureJs(text));
    },
    benchOptions
  );
  bench(
    `httpx/md5 (nodejs)`,
    () => {
      seeds.forEach((text) => httpxMd5NativeNodeJs(text));
    },
    benchOptions
  );
  bench(
    `npm:md5`,
    () => {
      seeds.forEach((text) => npmMd5(text));
    },
    benchOptions
  );
  bench(
    `npm:spark-md5`,
    () => {
      seeds.forEach((text) => npmSparkMd5.hash(text));
    },
    benchOptions
  );
});
