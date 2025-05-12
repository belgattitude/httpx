import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

import type { FlatTreeWsMap } from '../src/mapper/flat-tree-ws-mapper';

const isCiOrCodSpeed = vitestBenchOptionsConfig.isCiOrCodSpeed;

type Custom = {
  idx: number;
};

export const getBenchFlatTreeWsData = (): FlatTreeWsMap<Custom> => {
  const length = isCiOrCodSpeed ? 100 : 10_000;
  const arr = Array.from({ length });
  const map: FlatTreeWsMap<Custom> = new Map();
  for (let i = 0; i < arr.length; i++) {
    const key = String(i).padStart(String(length).length, '0');
    map.set(key, { idx: i });
  }
  return map;
};
