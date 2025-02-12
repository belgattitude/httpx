import type {
  createStableHashOrThrow as stableHash,
  createStableKeyOrThrow as stableKey,
} from '../src';

export const loadCreateStableKeyOrThrow = async () =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/stable-hash'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.createStableKeyOrThrow as unknown as typeof stableKey;
    })
    .catch((_e) => {
      const msg = 'Requires httpx/stable-key to be built (yarn build)';
      throw new Error(msg);
    });

export const loadCreateStableHashOrThrow = async () =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/stable-hash'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.createStableHashOrThrow as unknown as typeof stableHash;
    })
    .catch((_e) => {
      const msg = 'Requires httpx/stable-key to be built (yarn build)';
      throw new Error(msg);
    });
