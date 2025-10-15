import { assertType, expect, expectTypeOf } from 'vitest';

import { assertPlainObject } from '../assert-plain-object';
import type { PlainObjectDeepPartialUnknown } from '../internal.types';
import { isPlainObject } from '../is-plain-object';
import type { PlainObject } from '../plain-object.types';

describe('plain-object types tests', () => {
  describe('assertPlainObject', () => {
    describe('when no generic is given', () => {
      it('should return a type PlainObject compatible Record<string, unknown>', () => {
        const unknownPo = {
          key: 'value',
        } as unknown;

        // @ts-expect-error ensure our plain object is unknown
        const _notInferrable1 = unknownPo.key;
        // @ts-expect-error ensure our plain object is unknown
        const _notInferrable2 = unknownPo.invalidKey;

        // act
        assertPlainObject(unknownPo);

        assertType<PlainObject>(unknownPo);

        // Now the type is Record<string, unknown>, javascript allows to retrieve it
        // even if it doesn't exist. The value should be undefined|unknown
        const invalidKeyIsUnknown = unknownPo.invalidKey;
        expect(invalidKeyIsUnknown).toBe(undefined);
        // when removing the nullable (undefined) from the union
        expectTypeOf(invalidKeyIsUnknown).toBeUnknown();

        assertType<PlainObject>(unknownPo);
        assertType<Record<string, unknown>>(unknownPo);
        expectTypeOf(unknownPo.key).not.toBeString();
        expectTypeOf(unknownPo.key).not.toBeString();
      });
    });
  });

  describe('isPlainObject', () => {
    it.each([
      ['Atomics', Atomics],
      ['Math', Math],
      ['JSON', JSON],
    ] as const)(
      'should not allow passing static built-in classes',
      (name, cls) => {
        // @ts-expect-error for static built-in classes
        const runtimeTrue = isPlainObject(cls);
        expect(runtimeTrue).toBe(true);
      }
    );
    it(`should not make any assumptions when the value isn't statically known`, () => {
      const unknownPo = {
        key: 'value',
      } as unknown;
      const typed = isPlainObject(unknownPo);
      // eslint-disable-next-line @vitest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject>(unknownPo);
      expectTypeOf(unknownPo.key).not.toBeString();
    });
    it(`should preserve typings if value is statically known`, () => {
      const knownPo = {
        key: 'value',
      };
      const typed = isPlainObject(knownPo);
      // eslint-disable-next-line @vitest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject>(knownPo);
      expectTypeOf(knownPo.key).toBeString();
    });
    it('should offer convenience typings when a type is given', () => {
      type CustomType = {
        name: string;
        deep: {
          yes: boolean | null;
        };
      };
      const unknownPo = {
        name: 'hello',
        deep: {
          yes: true,
        },
      } as unknown;
      const typed = isPlainObject<CustomType>(unknownPo);
      // eslint-disable-next-line @vitest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject<CustomType>>(unknownPo);
      assertType<Record<string, unknown>>(unknownPo);
      assertType<object | undefined>(unknownPo?.deep);
      assertType<unknown>(unknownPo?.deep?.yes);
      expectTypeOf(unknownPo.name).not.toBeString();
    });

    it('should return a type PlainObject with shaped non null | undefined values', () => {
      type DeepCustomType = {
        id: number;
        requiredDeep: {
          idReq: number;
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
          idReq: 1,
        },
        data: {
          attributes: {
            url: 'cool',
            caption: 'test',
          },
        },
      } as unknown;
      const typed = isPlainObject<DeepCustomType>(po);
      // eslint-disable-next-line @vitest/no-conditional-in-test
      if (!typed) {
        throw new Error('Test code is incorrect');
      }
      assertType<PlainObject>(po);
      assertType<PlainObject<DeepCustomType>>(po);
      assertType<Record<string, unknown>>(po);
      assertType<Record<number, unknown>>(po);
      assertType<Record<string | number, unknown>>(po);
      assertType<PlainObjectDeepPartialUnknown<DeepCustomType>>(po);
      expectTypeOf(po?.data).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes).not.toBeUnknown();
      expectTypeOf(po?.data?.attributes?.url).toBeUnknown();
      expectTypeOf(po?.data?.attributes?.url).not.toBeString();
      expectTypeOf(po?.id).toBeUnknown();
      expectTypeOf(po?.requiredDeep?.idReq).toBeUnknown();
    });
  });
});
