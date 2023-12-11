import { isPlainObject } from '../typeguards';

describe('Typeguards tests', () => {
  describe('isPlainObject', () => {
    it.each([
      [{}, true],
      [{ name: 'seb' }, true],
      [{ children: [{ test: 1 }], name: 'deep' }, true],
      [{ constructor: { name: 'Object2' } }, true],
      [JSON.parse('{}'), true],
      // False
      [() => 'cool', false],
      [new (class Cls {})(), false],
      [new (class extends Object {})(), false],
      [new Date(), false],
      [new Map(), false],
      [new Error(), false],
      [new Set(), false],
      [new Request('http://localhost'), false],
      [/(\d+)/, false],
      [new Promise(() => {}), false],
      ['hello', false],
      [false, false],
      [undefined, false],
      [null, false],
      [10, false],
      [Number.NaN, false],
    ])('when "%p" is given, should return %p', (v, expected) => {
      expect(isPlainObject(v)).toStrictEqual(expected);
    });
  });
});
