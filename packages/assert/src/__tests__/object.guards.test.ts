import isPlainObj from 'is-plain-obj';

import { isPlainObject } from '../object.guards';

describe('Object typeguards tests', () => {
  describe('isPlainObject', () => {
    const str = 'key';
    const cases = [
      [{}, true],
      [Object.create(null), true],
      [{ 1: 'cool' }, true],
      [{ name: 'seb' }, true],
      [{ [str]: 'seb' }, true],
      [{ [Symbol('tag')]: 'value' }, true],
      [{ children: [{ test: 1 }], name: 'deep-plain' }, true],
      [
        { children: [{ test: new Date() }], name: 'deep-with-regular-object' },
        true,
      ],
      [{ constructor: { name: 'Object2' } }, true],
      [JSON.parse('{}'), true],
      // ############ Rejected #############################
      ['hello', false],
      [false, false],
      [undefined, false],
      [null, false],
      [10, false],
      [Number.NaN, false],
      // functions and objects
      [() => 'cool', false],
      [new (class Cls {})(), false],
      [new (class extends Object {})(), false],
      // Symbols
      [Symbol('cool'), false],
      [
        {
          [Symbol.iterator]: function* () {
            yield 1;
          },
        },
        false,
      ],
      [
        {
          [Symbol.toStringTag]: 'string-tagged',
        },
        false,
      ],
      // Static built-in classes
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
      [JSON, false],
      [Math, false],
      [Atomics, false],
      // built-in classes
      [new Date(), false],
      [new Map(), false],
      [new Error(), false],
      [new Set(), false],
      [new Request('http://localhost'), false],
      [new Promise(() => {}), false],
      [Promise.resolve({}), false],
      [Object.create({}), false],
      [/(\d+)/, false],
      // eslint-disable-next-line prefer-regex-literals
      [new RegExp('/d+/'), false],
      // Template literals
      [`cool`, false],
      [String.raw`rawtemplate`, false],
    ] as const;
    it.each(cases)('when "%s" is given, should return %s', (v, expected) => {
      expect(isPlainObject(v)).toStrictEqual(expected);
    });
    describe('Compatibility with is-plain-obj', () => {
      it.each(cases)(
        'compat when "%s" is given, should return %s',
        (v, expected) => {
          expect(isPlainObject(v)).toBe(isPlainObj(v));
        }
      );
    });
  });
});
