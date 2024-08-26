import { type FlatTreeWs, FlatTreeWsMapper } from '../src';

export const createBenchFlatTreeWs = (separator = '/') => {
  const length = 1000;
  const arr = Array.from({ length });
  const result: FlatTreeWs<undefined> = [];
  for (let i = 0; i < arr.length; i++) {
    const key = String(i).padStart(String(length).length, '0');
    result.push({
      key: `${key.slice(0, 2)}/${key.slice(-2)}`,
    });
  }
  return result;
};

export const createBenchTreeNodes = (separator = '/') => {
  const result = new FlatTreeWsMapper().toTreeNodes(
    createBenchFlatTreeWs(separator),
    {
      separator: '/',
    }
  );
  if (result.success) {
    return result.treeNodes;
  }
  throw new Error('Please fix the benchmarks data');
};
