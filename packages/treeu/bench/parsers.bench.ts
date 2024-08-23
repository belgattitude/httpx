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

  bench('treeify', () => {
    treeify(pathNames, {
      separator: '/',
    });
  });
});
