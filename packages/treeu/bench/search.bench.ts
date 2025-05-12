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
  const ranges = {
    first: 0,
    '1/4': Math.floor(arrData.length / 4),
    '1/2': Math.floor(arrData.length / 2),
    '3/4': Math.floor((arrData.length / 4) * 3),
    last: arrData.length - 1,
  };
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
    `DfsTreeSearch.findOne(id_${ranges.first}) over ${arrData.length}`,
    () => {
      search.findOne(arrData[ranges.first]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    `DfsTreeSearch.findOne(id_${ranges['1/2']}) over ${arrData.length}`,
    () => {
      search.findOne(arrData[ranges['1/2']]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    `DfsTreeSearch.findOne(id_${ranges['3/4']}) over ${arrData.length}`,
    () => {
      search.findOne(arrData[ranges['3/4']]!.key);
    },
    benchConfig.benchOptions
  );
  bench(
    `DfsTreeSearch.findOne(id_NotExists) over ${arrData.length}`,
    () => {
      search.findOne('not-exists');
    },
    benchConfig.benchOptions
  );
});
