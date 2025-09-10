const MAX_INT64 = 9_223_372_036_854_775_807n; // 2n ** 63n - 1n;
const MAX_UINT64 = 18_446_744_073_709_551_616n; // 2n ** 64n;

export type SignedInt64 = bigint & { __type: 'SignedInt64' };

export const bigintToSignedInt64 = (u: bigint): SignedInt64 => {
  return (u > MAX_INT64 ? u - MAX_UINT64 : u) as SignedInt64;
};
