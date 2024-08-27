import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import { DfsTreeSearch } from '../src/search/dfs-tree-search';
import { getBenchFlatTreeWsData } from './treeu-bench-data';

describe(`Bench search (10_000 entries)`, async () => {
  const wsData = getBenchFlatTreeWsData();
  const result = new FlatTreeWsMapper().toTreeNodes(wsData, {
    separator: '/',
  });
  if (!result.success) {
    console.log(result.issues);
    throw new Error(`Please fix the benchmarks: ${JSON.stringify(result)}`);
  }
  const { treeNodes } = result;

  const search = new DfsTreeSearch(treeNodes);
  bench('DfsTreeSearch.findOne(id_0)', () => {
    search.findOne(wsData[0]!.key);
  });
  bench('DfsTreeSearch.findOne(id_1000)', () => {
    search.findOne(wsData[1000]!.key);
  });
  bench('DfsTreeSearch.findOne(id_5000)', () => {
    search.findOne(wsData[5000]!.key);
  });
  bench('DfsTreeSearch.findOne(id_NotExists)', () => {
    search.findOne('not-exists');
  });
});
