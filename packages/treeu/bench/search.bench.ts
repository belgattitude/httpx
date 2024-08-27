import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import { DfsTreeSearch } from '../src/search/dfs-tree-search';
import { getTestFlatTreeWsData } from './treeu-test-data';

describe(`Bench search (10_000 entries)`, async () => {
  const result = new FlatTreeWsMapper().toTreeNodes(getTestFlatTreeWsData(), {
    separator: '/',
  });
  if (!result.success) {
    console.log(result.issues);
    throw new Error(`Please fix the benchmarks: ${JSON.stringify(result)}`);
  }
  const { treeNodes } = result;

  const search = new DfsTreeSearch(treeNodes);
  bench('TreeSearch findOne', () => {
    const _r = search.findOne(['id', '===', '04/00']);
  });
});
