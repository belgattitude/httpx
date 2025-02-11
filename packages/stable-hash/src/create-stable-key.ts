import { isPlainObject } from '@httpx/plain-object';

import { sortArr } from './sort-arr';
import { sortObjKeys } from './sort-obj-keys';

type SupportedDataTypes =
  | Record<string, unknown>
  | unknown[]
  | Date
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

type SupportedDataTypesRW = SupportedDataTypes | Readonly<SupportedDataTypes>;

type Options = {
  sortArrayValues?: boolean;
};

/**
 * Create a stable key from a given value useful for caching or memoization.
 *
 * Object keys are sorted to maintain equality between objects with
 * the same keys but in different order.
 *
 * This function is
 * @example
 * ```typescript
 * import { createStableKey } from '@httpx/stable-hash';
 *
 * const params = {
 *   key8: 'a string',
 *   key1: 1,
 *   key3: true,
 *   key2: [3, 2, 1],
 *   key7: {
 *     key2: true,
 *     key1: new Date('2025-02-11T08:58:32.075Z'),
 *   },
 * };
 *
 * const key = createStableKey(params);
 *
 * // Will return a string containing
 * // "{"key1":1,"key2":[1,2,3],"key3":true,"key7":{"key1":"2025-02-11T08:58:32.075Z","key2":true},"key8":"a string"}"
 * ```
 */
export const createStableKey = <T extends SupportedDataTypesRW>(
  value: T,
  options?: Options
): string => {
  const { sortArrayValues = true } = options ?? {};
  return JSON.stringify(value, (_, val) => {
    if (val === undefined) {
      return '[undefined]';
    }
    if (val === null) {
      return null;
    }
    const valType = typeof val;
    if (valType === 'bigint') {
      return `[${val}n]`;
    }
    if (['boolean', 'number', 'string'].includes(valType)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return val;
    }
    if (sortArrayValues && Array.isArray(val)) {
      return sortArr<unknown>(val);
    }
    if (isPlainObject(val)) {
      return sortObjKeys(val);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return val;
  });
};
