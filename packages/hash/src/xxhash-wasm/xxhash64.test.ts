import { expectTypeOf } from 'vitest';

import type { SignedInt64 } from '../utils/bigint-to-signed-int64';
import { createXXWasmHasher } from './create-xx-wasm-hasher';
import { getXXHashWasmInstance } from './get-xxhash-wasm-instance';
import { XXHash64 } from './xxhash64';

describe('XXHash64', async () => {
  const xxHashWasm = await getXXHashWasmInstance();
  const xxHash64 = await createXXWasmHasher();

  describe('toBigint', () => {
    it('should return a bigint', () => {
      const hash = xxHash64.toBigint('hello');
      expect(typeof hash).toBe('bigint');
    });
    it('should hash a know string', () => {
      const hash = xxHash64.toBigint('known string');
      expect(hash).toBe(4_605_036_177_168_426_352n);
    });
    it('should be deterministic for same input and seed', () => {
      const seed = 123n;
      const h1 = xxHash64.toBigint('deterministic', seed);
      const h2 = xxHash64.toBigint('deterministic', seed);
      expect(h1).toBe(h2);
    });
    it('should produce different hashes for different inputs', () => {
      const seed = 123n;
      const h1 = xxHash64.toBigint('input-a', seed);
      const h2 = xxHash64.toBigint('input-b', seed);
      expect(h1).not.toBe(h2);
    });
  });

  describe('toSigned64', () => {
    it('should return a bigint', () => {
      const hash = xxHash64.toSigned64('hello');
      expect(typeof hash).toBe('bigint');
    });
    it('should be type branded as SignedInt64', () => {
      const hash = xxHash64.toSigned64('hello');
      expectTypeOf(hash).toEqualTypeOf<SignedInt64>();
    });
    it('should hash a know string', () => {
      const hash = xxHash64.toSigned64('long string'.repeat(20));
      expect(hash).toBe(-8_545_599_274_714_813_119n);
    });
    it('should be within 64-bit signed integer range', () => {
      const s = xxHash64.toSigned64('range-check');
      const min = -(2n ** 63n);
      const max = 2n ** 63n - 1n;
      expect(s >= min && s <= max).toBe(true);
    });
    it('should match signed conversion of unsigned result', () => {
      const input = 'property-based check';
      const u = xxHash64.toBigint(input);
      const maxInt64 = 2n ** 63n - 1n;
      const maxUint64 = 2n ** 64n;
      const expected = u > maxInt64 ? u - maxUint64 : u;
      const s = xxHash64.toSigned64(input);
      expect(s).toBe(expected);
    });
  });

  describe('seeds and options', () => {
    it('should use the provided defaultSeed when none is passed', () => {
      const seed = 42n;
      const withDefault = new XXHash64(xxHashWasm, { defaultSeed: seed });
      const a = withDefault.toBigint('abc');
      const b = withDefault.toBigint('abc', seed);
      expect(a).toBe(b);
    });
    it('explicit seed should override the defaultSeed', () => {
      const defaultSeed = 42n;
      const explicitSeed = 7n;
      const withDefault = new XXHash64(xxHashWasm, { defaultSeed });
      const withoutExplicit = withDefault.toBigint('override-me');
      const withExplicit = withDefault.toBigint('override-me', explicitSeed);
      // Sanity check: same explicit seed through two code paths is equal
      const directExplicit = xxHash64.toBigint('override-me', explicitSeed);
      expect(withExplicit).toBe(directExplicit);
      // Extremely unlikely to be equal to the default-seeded hash
      expect(withExplicit).not.toBe(withoutExplicit);
    });
  });
});
