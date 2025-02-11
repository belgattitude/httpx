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

/**
 *
 * @example
 * ```typescript
 * import { createStableKey } from '@httpx/stable-hash';
 *
 * const params = {
 *   a: null,
 *   c: undefined,
 *   isOk: true,
 *   isNotOk: false,
 *   date: new Date('2025-02-11T08:58:32.075z'),
 *   strArr: ['a', 'z', 'b],
 *   numberArr: [4, 3.1, 3, 10],
 *   bigintArr: [11n, 10n],
 *   str: 'Hello',
 *   nestedObject: {
 *     z: 'last',
 *     a: 'first',
 *   }
 *   nestedArray: {
 *     arr: [1, 2, 3],
 *   }
 * }
 *
 * const strHash = createStableKey(params);
 *
 * // Will return a string containing
 * // {"a":null,"bigintArr":["[10n]","[11n]"],"c":"[undefined]","date":"2025-02-11T08:58:32.075Z","isNotOk":false,"isOk":true,"nestedArray":{"arr":[1,2,3]},"nestedObject":{"a":"first","z":"last"},"numberArr":[3,3.1,4,10],"str":"Hello","strArr":["a","b","z"]}
 * ```
 */
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
