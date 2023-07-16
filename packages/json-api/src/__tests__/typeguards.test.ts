import { isPlainObject } from '../';

describe('Typeguards tests', () => {
  describe('isPlainObject', () => {
    it.each([
      [{}, true],
      [{ name: 'seb' }, true],
      [{ name: 'deep', children: [{ test: 1 }] }, true],
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
