export const isTrivialValue = (data: unknown): boolean => {
  const dataType = typeof data;
  if (
    ['boolean', 'number', 'bigint', 'symbol', 'undefined', 'function'].includes(
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
