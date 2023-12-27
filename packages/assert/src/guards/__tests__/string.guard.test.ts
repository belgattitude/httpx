import { describe, expect, it } from 'vitest';

import { isStrNotEmpty } from '../string.guards';

describe('Typeguards string tests', () => {
  describe('isStrNotEmpty', () => {
    it('should trim by default', () => {
      expect(isStrNotEmpty('  ')).toStrictEqual(isStrNotEmpty(''));
    });
    describe('when trim === true (default)', () => {
      it('should pass expectations', () => {
        expect(isStrNotEmpty('cool')).toBe(true);
        expect(isStrNotEmpty(1)).toBe(false);
        expect(isStrNotEmpty('  ')).toBe(false);
        expect(isStrNotEmpty('')).toBe(false);
        expect(isStrNotEmpty(null)).toBe(false);
        expect(isStrNotEmpty({})).toBe(false);
      });
    });
    describe('when trim === false', () => {
      it('should work as expected', () => {
        expect(isStrNotEmpty('  ', false)).toBe(true);
      });
    });
  });
});
