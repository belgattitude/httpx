export const sortObjKeys = <T extends object>(object: T): T => {
  const sortedKeys = Object.keys(object).sort() as unknown as [keyof T];
  const sorted = {} as T;
  for (const key of sortedKeys) {
    sorted[key] = object[key];
  }
  return sorted;
};
