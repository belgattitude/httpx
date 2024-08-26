import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import type { FlatTreeWs } from '../src/mapper/flat-tree-ws-mapper';
import { DfsTreeSearch } from '../src/search/dfs-tree-search';

const getPathNames = () => {
  const length = 1000;
  const arr = Array.from({ length });
  const result: FlatTreeWs<undefined> = [];
  for (let i = 0; i < arr.length; i++) {
    const key = String(i).padStart(String(length).length, '0');
    result.push({
      key: key.slice(0, 2) + '/' + key.slice(-2),
    });
  }
  return result;
};

describe(`Bench search`, async () => {
  const result = new FlatTreeWsMapper().toTreeNodes(getPathNames(), {
    separator: '/',
  });
  if (!result.success) {
    throw new Error('Please fix the benchmarks');
  }
  const { treeNodes } = result;

  const search = new DfsTreeSearch(treeNodes);
  bench('TreeSearch findBy', () => {
    const _r = search.findBy(['id', '===', '04/00']);
  });
});
