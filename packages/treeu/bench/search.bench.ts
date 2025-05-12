import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import { DfsTreeSearch } from '../src/search/dfs-tree-search';
import { benchConfig } from './bench-config';
import { getBenchFlatTreeWsData } from './treeu-bench-data';

describe(`Bench search (10_000 entries)`, async () => {
  const wsData = getBenchFlatTreeWsData();

  const arrData = Array.from(wsData).map(([key, value]) => ({
    key,
    value,
  }));
  const result = new FlatTreeWsMapper().toTreeNodes(wsData, {
    separator: '/',
  });
  if (!result.success) {
    console.log(result.issues);
    throw new Error(`Please fix the benchmarks: ${JSON.stringify(result)}`);
  }
  const { treeNodes } = result;

  const search = new DfsTreeSearch(treeNodes);
  bench(
    'DfsTreeSearch.findOne(id_0) over 10_000',
    () => {
      search.findOne(arrData[0]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    'DfsTreeSearch.findOne(id_1000) over 10_000',
    () => {
      search.findOne(arrData[1000]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    'DfsTreeSearch.findOne(id_5000) over 10_000',
    () => {
      search.findOne(arrData[5000]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    'DfsTreeSearch.findOne(id_NotExists) over 10_000',
    () => {
      search.findOne('not-exists');
    },
    benchConfig.benchOptions
  );
});
