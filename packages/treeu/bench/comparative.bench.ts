import { bench, describe } from 'vitest';

import { DfsTreeSearch } from '../src/search/dfs-tree-search';
import { createBenchTreeNodes } from './treeu-bench-data';

describe.skip(`Treeu search comparative`, async () => {
  const treeNodes = createBenchTreeNodes('/');

  const search = new DfsTreeSearch(treeNodes);
  bench('TreeSearch findOne', () => {
    const _r = search.findOne(['id', '===', '04/00']);
  });
});
