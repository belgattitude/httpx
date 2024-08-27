import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import { getTestFlatTreeWsData } from './treeu-test-data';

describe(`Bench mapper (10_000 entries)`, async () => {
  const pathNames = getTestFlatTreeWsData();
  bench('FlatTreeWsMapper.toTreeNodesOrThrow', () => {
    new FlatTreeWsMapper().toTreeNodesOrThrow(pathNames, {
      separator: '/',
    });
  });
});
