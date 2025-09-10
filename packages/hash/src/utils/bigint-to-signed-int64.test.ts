import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  bigintToSignedInt64,
  type SignedInt64,
} from './bigint-to-signed-int64';

// Constants for reference inside tests
const MAX_INT64 = 9_223_372_036_854_775_807n; // 2^63 - 1
const MAX_UINT64 = 18_446_744_073_709_551_616n; // 2^64

describe('bigintToSignedInt64', () => {
  it('returns a bigint and is branded as SignedInt64', () => {
    const v = 0n;
    const s = bigintToSignedInt64(v);
    expect(typeof s).toBe('bigint');
    expectTypeOf(s).toEqualTypeOf<SignedInt64>();
  });

  it('0 -> 0', () => {
    expect(bigintToSignedInt64(0n)).toBe(0n as any);
  });

  it('MAX_INT64 stays positive', () => {
    expect(bigintToSignedInt64(MAX_INT64)).toBe(MAX_INT64 as any);
  });

  it('MAX_INT64+1 -> -2^63', () => {
    const minInt64 = -(1n << 63n);
    expect(bigintToSignedInt64(MAX_INT64 + 1n)).toBe(minInt64 as any);
  });

  it('MAX_UINT64-1 -> -1', () => {
    expect(bigintToSignedInt64(MAX_UINT64 - 1n)).toBe(-1n as any);
  });

  it('throws RangeError for inputs < 0', () => {
    expect(() => bigintToSignedInt64(-1n)).toThrow(RangeError);
    expect(() => bigintToSignedInt64(-123n)).toThrow(RangeError);
  });

  it('throws RangeError for inputs >= 2^64', () => {
    expect(() => bigintToSignedInt64(MAX_UINT64)).toThrow(RangeError);
    expect(() => bigintToSignedInt64(MAX_UINT64 + 1n)).toThrow(RangeError);
  });

  it("matches manual two's complement conversion for a few valid samples", () => {
    const samples: bigint[] = [
      1n,
      123n,
      456_789n,
      (1n << 32n) + 7n,
      (1n << 63n) - 1n,
      1n << 63n,
      (1n << 64n) - 2n,
      (1n << 64n) - 1n,
    ];
    const maxInt64 = MAX_INT64;
    const maxUint64 = MAX_UINT64;
    for (const u of samples) {
      const expected = u > maxInt64 ? u - maxUint64 : u;
      expect(bigintToSignedInt64(u)).toBe(expected as any);
    }
  });
});
