export const loadCreateStableKeyOrThrow = async () =>
  await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
    '@httpx/stable-hash'
  )
    .then((mod) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      return mod.createStableKeyOrThrow;
    })
    .catch((_e) => {
      const msg =
        'Bench createStableKeyOrThrow Requires httpx/stable-hash to be built (yarn build)';
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
      return mod.createStableHashOrThrow;
    })
    .catch((_e) => {
      const msg =
        'Bench createStableHashOrThrow requires httpx/stable-hash to be built (yarn build)';
      throw new Error(msg);
    });
