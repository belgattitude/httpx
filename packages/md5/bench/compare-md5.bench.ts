import { md5 } from '@httpx/md5';
import { default as ImportednodeMd5 } from 'md5';
import { default as ImportedSparkMd5 } from 'spark-md5';
import { bench, describe } from 'vitest';

const SparkMd5 = ImportedSparkMd5;
const nodeMd5 = ImportednodeMd5;

const benchOptions = {
  warmupIterations: 1,
  iterations: 1,
};

const seeds = Array.from({ length: 100_000 }).map((_, i) => {
  return `seed-${i}`;
});

describe(`@httpx/md5 compared`, async () => {
  bench(
    `@httpx/md5`,
    () => {
      seeds.forEach((text) => md5(text));
    },
    benchOptions
  );
  bench(
    `md5`,
    () => {
      seeds.forEach((text) => nodeMd5(text));
    },
    benchOptions
  );
  bench(
    `spark-md5`,
    () => {
      seeds.forEach((text) => SparkMd5.hash(text));
    },
    benchOptions
  );
});
