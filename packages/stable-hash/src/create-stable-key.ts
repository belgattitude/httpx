import { isPlainObject } from '@httpx/plain-object';

import { sortArr } from './sort-arr';
import { sortObjKeys } from './sort-obj-keys';

type SupportedDataTypes =
  | Record<string, unknown>
  | unknown[]
  | Date
  | Map<string, unknown>
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

type SupportedDataTypesRW = SupportedDataTypes | Readonly<SupportedDataTypes>;

export const createStableKey = <T extends SupportedDataTypesRW>(
  value: T
): string => {
  return JSON.stringify(value, (_, val) => {
    if (val === undefined) {
      return '[undefined]';
    }
    if (val === null) {
      return null;
    }
    if (typeof val === 'bigint') {
      return `[${val}n]`;
    }
    if (isPlainObject(val)) {
      return sortObjKeys(val);
    }
    if (Array.isArray(val)) {
      return sortArr<unknown>(val);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return val;
  });
};
