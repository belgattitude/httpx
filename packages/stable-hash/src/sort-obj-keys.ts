export const sortObjKeys = <T extends object>(object: T): T => {
  return Object.fromEntries(Object.entries(object).sort()) as unknown as T;
};
