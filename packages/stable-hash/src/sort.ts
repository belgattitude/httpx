import { isPlainObject } from '@httpx/plain-object';

import { sortObjKeys } from './sort-obj-keys';

export const sort = <T extends unknown[] | Record<string, unknown>>(
  value: T
): T => {
  const type = typeof value;
  if (Array.isArray(value)) {
    return value.toSorted() as unknown as T;
  }
  if (isPlainObject(value)) {
    return sortObjKeys(value);
  }
  return value;
};
