export const isCompressible = (
  data: unknown,
  params?: {
    strMinLength?: number;
  }
): boolean => {
  const { strMinLength = 10_000 } = params ?? {};
  const dataType = typeof data;

  if (typeof data === 'string') {
    return data.length >= strMinLength;
  }
  if (
    ['boolean', 'number', 'bigint', 'symbol', 'undefined', 'function'].includes(
      dataType
    )
  ) {
    return false;
  }
  return true;
};
