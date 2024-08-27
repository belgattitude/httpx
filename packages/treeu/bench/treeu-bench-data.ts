import type { FlatTreeWs } from '../src';

export const getBenchFlatTreeWsData = (): FlatTreeWs<undefined> => {
  const length = 10_000;
  const arr = Array.from({ length });
  const result: FlatTreeWs<undefined> = [];
  for (let i = 0; i < arr.length; i++) {
    const key = String(i).padStart(String(length).length, '0');
    result.push({
      key: key.slice(0, 3) + '/' + key.slice(-3),
    });
  }
  return result;
};
