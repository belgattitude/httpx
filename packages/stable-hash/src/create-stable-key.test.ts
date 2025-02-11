import { createStableKey } from './create-stable-key';

describe('createStableKey', () => {
  describe('Return a result object', () => {
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
      expect(createStableKey(baseParams)).toStrictEqual({
        success: true,
        key: '{"bigint":"[1n]","boolean":true,"date":"2025-02-11T08:58:32.075Z","null":null,"number":1,"string":"string","undefined":"[undefined]"}',
      });
    });
  });
});
