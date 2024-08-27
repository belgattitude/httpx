import type { FlatTreeWsMap } from '../src/mapper/flat-tree-ws-mapper';

type Custom = {
  idx: number;
};

export const getBenchFlatTreeWsData = (): FlatTreeWsMap<Custom> => {
  const length = 10_000;
  const arr = Array.from({ length });
  const map: FlatTreeWsMap<Custom> = new Map();
  for (let i = 0; i < arr.length; i++) {
    const key = String(i).padStart(String(length).length, '0');
    map.set(key, { idx: i });
  }
  return map;
};
