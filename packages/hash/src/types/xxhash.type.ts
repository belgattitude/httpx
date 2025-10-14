export type XXHash64DefaultOptions = {
  /**
   * The seed to use for hashing. If not provided, a default 0n seed will be used.
   * Spark generally uses 42 as the default seed.
   */
  defaultSeed?: bigint;
};

export type XXHash64Options = {
  /**
   * The seed to use for hashing. If not provided, a default 0n seed will be used.
   * Spark generally uses 42 as the default seed.
   */
  seed?: bigint;
};
