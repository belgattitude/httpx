import { bench, describe } from 'vitest';

import { treeify } from '../src';

/**
 * Based on a hypothesis:
 * `isPlainObject` is called 70% of the time with valid plain objects,
 * 10% with maps, 10% with nulls, 5% with undefined and 5% with string.
 */
const getPathNames = (length: number) =>
  Array.from({ length }).map((_) => ({
    key: 'aa',
  }));

describe(`Bench treeify`, async () => {
  const pathNames = getPathNames(10_000);

  const compiledTreeify = await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    '@httpx/treeu'
  )
    .then((mod) => mod.treeify)
    .catch((_e) => {
      throw new Error(
        'Compiled benchmarks version requires httpx/treeu to be built (yarn build)'
      );
    });

  bench('compiled treeify (dist files)', () => {
    compiledTreeify(pathNames, {
      separator: '/',
    });
  });

  bench('source treeify (local dev)', () => {
    treeify(pathNames, {
      separator: '/',
    });
  });
});
