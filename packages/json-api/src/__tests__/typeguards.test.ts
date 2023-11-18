import { isPlainObject } from '../typeguards';

describe('Typeguards tests', () => {
  describe('isPlainObject', () => {
    it.each([
      [{}, true],
      [{ name: 'seb' }, true],
      [{ children: [{ test: 1 }], name: 'deep' }, true],
      [new Date(), false],
      [false, false],
      [undefined, false],
      [null, false],
      [() => 'cool', false],
    ])('when "%p" is given, should return %p', (v, expected) => {
      expect(isPlainObject(v)).toStrictEqual(expected);
    });
  });
});
