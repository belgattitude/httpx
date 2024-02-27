import type { ParsableDsn, WeakOpaqueContainer } from '../dsn-parser.type';
import { isParsableDsn } from '../is-parsable-dsn';

describe('isParsableDsn types', () => {
  it('should return an opaque type', () => {
    const parsableDsn = 'redis://localhost' as ParsableDsn;
    expect(isParsableDsn(parsableDsn)).toBe(true);
    expectTypeOf(parsableDsn).toMatchTypeOf<string>();
    expectTypeOf(parsableDsn).toMatchTypeOf<
      WeakOpaqueContainer<'ParsableDsn'>
    >();
  });
  it('should allow to enforce method signature with WeakOpaqueType', () => {
    const fnWithOpaque = (_dsn: ParsableDsn) => true;
    const dsnAsString = 'redis://localhost';
    // @ts-expect-error to enforce test to trigger an error
    expect(fnWithOpaque(dsnAsString)).toBe(true);
  });
  it('should allow string if not enforced', () => {
    const fnWithString = (_dsn: string) => true;
    const dsnAsString = 'redis://localhost';
    expect(fnWithString(dsnAsString)).toBe(true);
  });
});
