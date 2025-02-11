import { createStableHashOrThrow } from './create-stable-hash-or-throw';

const isNodeLike = !('window' in globalThis);
const isNode18 =
  isNodeLike && (process?.versions?.node ?? '').startsWith('18.');

describe.skipIf(isNode18)('createStableHashOrThrow', async () => {
  const params1 = {
    z: 'world',
    a: 'hello',
    obj: {
      z: 'world',
      a: 'hello',
    },
  } as const;

  const params1DifferentOrder = {
    a: 'hello',
    obj: {
      a: 'hello',
      z: 'world',
    },
    z: 'world',
  } as const satisfies typeof params1;

  it('should return a hex string', async () => {
    const hash = await createStableHashOrThrow(params1);
    expect(hash).toStrictEqual(
      'cb718c12f6933b7b5beafe4d73ab98ab11d834a34c07f134d26f76501e71cc33'
    );
  });

  it('should return the same string if params are in different order', async () => {
    const hash1 = await createStableHashOrThrow(params1);
    const hash2 = await createStableHashOrThrow(params1DifferentOrder);
    expect(hash1).toStrictEqual(hash2);
  });
  describe('Example', () => {
    it('should match expected sha', async () => {
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

      const hash = await createStableHashOrThrow(params);
      expect(hash).toStrictEqual(
        'fb17a6300efcf62ae80708e2a672aee581b7f0dd7c6a9a7a748218846c679394'
      );
    });
  });
});
