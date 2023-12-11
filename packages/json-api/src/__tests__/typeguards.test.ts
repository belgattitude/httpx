import { isPlainObject } from '../typeguards';

describe('Typeguards tests', () => {
  describe('isPlainObject', () => {
    it.each([
      [{}, true],
      [{ name: 'seb' }, true],
      [{ children: [{ test: 1 }], name: 'deep' }, true],
      [new Date(), false],
      [new (class Cls {})(), false],
      [new Map(), false],
      [new Error(), false],
      [new Set(), false],
      [false, false],
      [undefined, false],
      [null, false],
      [Number.NaN, false],
      [new Request('http://localhost'), false],
      [() => 'cool', false],
    ])('when "%p" is given, should return %p', (v, expected) => {
      expect(isPlainObject(v)).toStrictEqual(expected);
    });
  });
});
