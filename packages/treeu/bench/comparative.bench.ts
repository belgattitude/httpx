import { bench, describe } from 'vitest';

import { TreeSearch } from '../src/search/tree-search';
import { createBenchTreeNodes } from './treeu-bench-data';

describe.skip(`Treeu search comparative`, async () => {
  const treeNodes = createBenchTreeNodes('/');

  const search = new TreeSearch(treeNodes);
  bench('TreeSearch findBy', () => {
    const _r = search.findBy(['id', '===', '04/00']);
  });
});
