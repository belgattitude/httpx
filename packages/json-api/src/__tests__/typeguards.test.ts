import { isPlainObject } from '../typeguards';

describe('Typeguards tests', () => {
  describe('isPlainObject', () => {
    it.each([
      [{}, true],
      [{ name: 'seb' }, true],
      [{ children: [{ test: 1 }], name: 'deep' }, true],
      [{ constructor: { name: 'Object2' } }, true],
      [new Date(), false],
      [new (class Cls {})(), false],
      [new (class extends Object {})(), false],
      [new Map(), false],
      [new Error(), false],
      [new Set(), false],
      [/(\d+)/, false],
      [new Promise(() => {}), false],
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
