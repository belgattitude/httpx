export const isStrNotEmpty = (
  v: unknown,
  options?: { trim: boolean }
): v is string => {
  const { trim = true } = options ?? {};
  return typeof v === 'string' && (trim ? v.trim() : v).length > 0;
};
