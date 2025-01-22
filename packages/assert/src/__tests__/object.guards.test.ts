import { isPlainObject } from '../object.guards';

describe('Object typeguards tests', () => {
  const isNodeLike = !('window' in globalThis);
  const isCloudflareWorker = 'caches' in globalThis;

  describe('isPlainObject', () => {
    const str = 'key';

    function fnWithProto(x: number) {
      // @ts-expect-error for the sake of testing
      this.x = x;
    }

    function ObjectConstructor() {}

    ObjectConstructor.prototype.constructor = Object;

    const validPlainObjects = [
      [{}, true],
      [Object.create(null), true],
      [new Object({ key: 'new_object' }), true],
      [new Object({ key: new Date() }), true],
      [{ 1: 'integer_key' }, true],
      [{ name: 'string_key' }, true],
      [{ [str]: 'dynamic_string_key' }, true],
      [{ [Symbol('tag')]: 'value' }, true],
      [{ children: [{ key: 'deep-children' }], name: 'deep-plain' }, true],
      [
        { children: [{ key: new Date() }], name: 'deep-with-regular-object' },
        true,
      ],
      [{ constructor: { name: 'Object2' } }, true],
      [JSON.parse('{}'), true],
      [new Proxy({}, {}), true],
      [new Proxy({ key: 'proxied_key' }, {}), true],
      [
        {
          [Symbol.iterator]: function* () {
            yield 1;
          },
        },
        true,
      ],
      [
        {
          [Symbol.toStringTag]: 'string-tagged',
        },
        true,
      ],
    ] as const;

    const validPlainObjectsBuiltIn = [
      // Static built-in classes
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
      [JSON, true],
      [Math, true],
      [Atomics, true],
    ] as const;

    const invalidPlainObjects = [
      ['hello', false],
      [false, false],
      [undefined, false],
      [null, false],
      [10, false],
      [[], false],
      [Number.NaN, false],
      // functions and objects
      [() => 'cool', false],
      [new (class Cls {})(), false],
      [new Intl.Locale('en'), false],
      [new (class extends Object {})(), false],
      [fnWithProto, false],
      // Symbols
      [Symbol('cool'), false],
      // Built-in classes
      [new Date(), false],
      [new Map(), false],
      [new Error(), false],
      [new Set(), false],
      [new Request('http://localhost'), false],
      [new Promise(() => {}), false],
      [Promise.resolve({}), false],
      [new Uint8Array([1, 2, 3]), false],
      [Object.create({}), false],
      [/(\d+)/, false],
      // eslint-disable-next-line prefer-regex-literals
      [new RegExp('/d+/'), false],
      [/d+/, false],
      // Template literals
      [`cool`, false],
      [String.raw`rawtemplate`, false],
      // @ts-expect-error to allow testing crafted object
      [new ObjectConstructor(), false],
      [
        new Proxy(new Date(), {
          get(target, _prop, _receiver) {
            return target;
          },
        }),
        false,
      ],
    ] as const;

    const cases = [
      ...validPlainObjects,
      ...validPlainObjectsBuiltIn,
      ...invalidPlainObjects,
    ] as const;
    it.each(cases)('when "%s" is given, should return %s', (v, expected) => {
      expect(isPlainObject(v)).toStrictEqual(expected);
    });

    it.skipIf(!isNodeLike)(
      'should return false when node Buffer is given',
      () => {
        // eslint-disable-next-line no-restricted-globals
        expect(isPlainObject(Buffer.from('123123'))).toBe(false);
      }
    );

    it('should return true when globalThis is given', () => {
      expect(isPlainObject(globalThis)).toBe(false);
    });
  });
  describe.skipIf(!isNodeLike || isCloudflareWorker)(
    'Support node:vm.runInNewContext',
    () => {
      it('should support vm', async () => {
        // eslint-disable-next-line import-x/no-nodejs-modules
        const runInNewContext = await import('node:vm').then(
          (mod) => mod.runInNewContext
        );
        expect(isPlainObject(runInNewContext('({})'))).toBe(true);
        expect(isPlainObject(runInNewContext('(false)'))).toBe(false);
        expect(isPlainObject(runInNewContext('(new Date())'))).toBe(false);
      });
    }
  );
});
