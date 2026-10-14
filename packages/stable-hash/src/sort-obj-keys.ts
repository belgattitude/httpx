export const sortObjKeys = <T extends object>(object: T): T => {
  // oxlint-disable-next-line unicorn/no-array-sort -- Object.keys() returns a fresh array, toSorted() is ES2023 (dist targets es2022)
  const sortedKeys = Object.keys(object).sort() as unknown as [keyof T];
  const sorted = {} as T;
  for (const key of sortedKeys) {
    sorted[key] = object[key];
  }
  return sorted;
};
