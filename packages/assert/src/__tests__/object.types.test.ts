import { assertType } from 'vitest';

import { assertPlainObject } from '../object.asserts';
import { isPlainObject } from '../object.guards';
import type {
  PlainObject,
  PlainObjectDeepPartialUnknown,
} from '../object.types';

describe('object types tests', () => {
  describe('isPlainObject', () => {
    it('should return a type PlainObject compatible with object', () => {
      const po = {};
      assertPlainObject(po);
      assertType<PlainObject>(po);
      assertType<Record<string | number, unknown>>(po);
    });

    it('should return a type PlainObject with shaped values', () => {
      type CustomType = {
        name: string;
        deep: {
          yes: boolean | null;
        };
      };
      const po = {
        name: 'hello',
        deep: {
          yes: true,
        },
      } as unknown;
      const typed = isPlainObject<CustomType>(po);
      // eslint-disable-next-line jest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject<CustomType>>(po);
      assertType<Record<string | number, unknown>>(po);
      assertType<object | undefined>(po?.deep);
      assertType<unknown>(po?.deep?.yes);
    });

    it('should return a type PlainObject with shaped non null | undefined values', () => {
      type DeepCustomType = {
        id: number;
        requiredDeep: {
          id: number;
        };
        data?: {
          test: string[];
          attributes?: {
            url?: string | null;
            caption?: string | null;
            alternativeText?: string | null;
          } | null;
        } | null;
      };
      const po = {
        id: 1,
        requiredDeep: {
          id: 1,
        },
        data: {
          attributes: {
            url: 'cool',
            caption: 'test',
          },
        },
      } as unknown;
      const typed = isPlainObject<DeepCustomType>(po);
      // eslint-disable-next-line jest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject>(po);
      assertType<PlainObject<DeepCustomType>>(po);
      assertType<Record<string | number, unknown>>(po);
      assertType<PlainObjectDeepPartialUnknown<DeepCustomType>>(po);
      expectTypeOf(po?.data).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes?.url).toBeUnknown();
      expectTypeOf(po?.id).toBeUnknown();
      expectTypeOf(po?.requiredDeep?.id).toBeUnknown();
    });
  });
});
