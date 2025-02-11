import { createStableKey } from './create-stable-key';

describe('createStableKey', () => {
  describe('base types', () => {
    const stableDate = new Date('2025-02-11T08:58:32.075z');
    const baseTypes = [
      [null, 'null'],
      [undefined, '"[undefined]"'],
      [true, 'true'],
      [false, 'false'],
      [stableDate, '"2025-02-11T08:58:32.075Z"'],
      [[1], '[1]'],
      [[1, 2], '[1,2]'],
      [9_007_199_254_740_991n, '"[9007199254740991n]"'],
    ] as const satisfies [value: unknown, expected: string][];
    it.each(baseTypes)(
      'when %s is provided, should return %s',
      (value, expected) => {
        expect(createStableKey(value)).toBe(expected);
      }
    );
  });

  describe('Object params', () => {
    const baseParams = {
      string: 'string',
      number: 1,
      date: new Date('2025-02-11T08:58:32.075z'),
      boolean: true,
      bigint: BigInt(1),
      null: null,
      undefined: undefined,
    } as const;

    it('should return a sort object params', () => {
      expect(createStableKey(baseParams)).toBe(
        '{"bigint":"[1n]","boolean":true,"date":"2025-02-11T08:58:32.075Z","null":null,"number":1,"string":"string","undefined":"[undefined]"}'
      );
    });

    it('should sort nested objects params', () => {
      const nested = {
        boolean: true,
        nested: { params: baseParams },
      } as const;
      expect(createStableKey(nested)).toBe(
        '{"boolean":true,"nested":{"params":{"bigint":"[1n]","boolean":true,"date":"2025-02-11T08:58:32.075Z","null":null,"number":1,"string":"string","undefined":"[undefined]"}}}'
      );
    });

    it('Test full example', () => {
      const params = {
        key8: 'a string',
        key1: 1,
        key3: true,
        key2: [3, 2, 1],
        key7: {
          key2: true,
          key1: new Date('2025-02-11T08:58:32.075Z'),
        },
      };
      const strHash = createStableKey(params);
      expect(strHash).toMatchSnapshot();
    });
  });
});
