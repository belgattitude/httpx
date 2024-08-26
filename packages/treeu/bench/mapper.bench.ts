import { bench, describe } from 'vitest';

import { FlatTreeWsMapper } from '../src';
import type { FlatTreeWs } from '../src/mapper/flat-tree-ws-mapper';

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

describe(`Bench mapper`, async () => {
  const pathNames = getPathNames();
  bench('FlatTreeWsMapper.toTreeNodes', () => {
    const _r = new FlatTreeWsMapper().toTreeNodes(pathNames, {
      separator: '/',
    });
  });
});
