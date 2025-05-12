import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import { benchConfig } from './bench-config';
import { getBenchFlatTreeWsData } from './treeu-bench-data';

describe(`Bench mapper (10_000 entries)`, async () => {
  const pathNames = getBenchFlatTreeWsData();
  bench(
    'FlatTreeWsMapper.toTreeNodesOrThrow',
    () => {
      new FlatTreeWsMapper().toTreeNodesOrThrow(pathNames, {
        separator: '/',
      });
    },
    benchConfig.benchOptions
  );
});
