const MAX_UINT64 = 18_446_744_073_709_551_616n; // 2n ** 64n

export type SignedInt64 = bigint & { __type: 'SignedInt64' };

/**
 * Convert an arbitrary bigint to a signed 64-bit integer
 *
 * Notes:
 * - If `unsignedBigint` is outside the [0, 2^64-1] range or even negative, it will be
 *   normalized to its low 64 bits before conversion, matching two's
 *   complement behavior.
 * - This function is safe to use with values returned by xxhash-wasm (always
 *   within [0, 2^64-1]).
 *
 * @throws RangeError is the input is outside the [0, 2^64] range.
 */
export const bigintToSignedInt64 = (unsignedBigint: bigint): SignedInt64 => {
  if (unsignedBigint < 0n || unsignedBigint >= MAX_UINT64) {
    throw new RangeError('Value must be in the range [0, 2^64)');
  }
  return BigInt.asIntN(64, unsignedBigint) as SignedInt64;
};
