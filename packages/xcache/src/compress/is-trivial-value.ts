/**
 * Whether the data is worth compressing.
 *
 * Note: despite its name, returns false for trivial values (booleans,
 * numbers, bigint, symbols, functions, null, undefined and empty arrays).
 */
export const isTrivialValue = (data: unknown): boolean => {
  const dataType = typeof data;
  if (
    ["boolean", "number", "bigint", "symbol", "undefined", "function"].includes(
      dataType
    ) ||
    data === null
  ) {
    return false;
  }
  if (Array.isArray(data) && data.length === 0) {
    return false;
  }
  return true;
};
