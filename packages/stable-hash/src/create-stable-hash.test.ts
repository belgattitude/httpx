import { createStableHash } from './create-stable-hash';

describe(`createStableHash`, async () => {
  describe('Example', () => {
    it('should match expected result', async () => {
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

      const result = await createStableHash(params);
      expect(result).toStrictEqual({
        success: true,
        hash: 'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394',
      });
    });
  });
});
