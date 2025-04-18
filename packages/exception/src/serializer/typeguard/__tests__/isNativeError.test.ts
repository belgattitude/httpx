import { describe, expect, it } from 'vitest';

import type { NativeError } from '../../types';
import { isNativeError, nativeErrors } from '../isNativeError';

describe('isNativeError', () => {
  describe('when a native error is provided', () => {
    const native = nativeErrors.map((errorCls) => {
      const err = new errorCls();
      return [err.name, err];
    }) as [name: string, err: NativeError][];

    it.each(native)('should return true for %p', (_name, err) => {
      expect(isNativeError(err)).toBe(true);
    });
  });
  describe('when a custom error is provided', () => {
    it('should return false for %s', () => {
      class NonNativeError extends Error {
        constructor(message: string) {
          super(message);
          Object.setPrototypeOf(this, NonNativeError.prototype);
          this.name = 'NonNativeError';
        }
      }
      const e = new NonNativeError('cool');
      expect(isNativeError(e)).toBe(false);
    });
  });

  it.each([
    ['Date', new Date()],
    ['null', null],
    ['undefined', undefined],
  ])('"%p" is not native', (_name, err) => {
    expect(isNativeError(err as unknown as Error)).toBe(false);
  });
});
