import { assertType } from 'vitest';

import { assertPlainObject } from '../object.asserts';
import { isPlainObject } from '../object.guards';
import type { PlainObject } from '../object.types';

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

    it('should return a type PlainObject with shaped values 2', () => {
      type DeepCustomType = {
        data?: {
          attributes?: {
            url?: string | null;
            caption?: string | null;
            alternativeText?: string | null;
          } | null;
        } | null;
      };
      const po: DeepCustomType = {
        data: {
          attributes: {
            url: 'cool',
            caption: 'test',
          },
        },
      };
      const typed = isPlainObject<DeepCustomType>(po);
      // eslint-disable-next-line jest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject>(po);
      assertType<PlainObject<DeepCustomType>>(po);
      assertType<Record<string | number, unknown>>(po);
      assertType<DeepCustomType>(po);
      assertType<string | undefined | null>(po.data?.attributes?.url);
    });
  });
});
