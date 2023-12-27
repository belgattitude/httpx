export const isStrNotEmpty = (v: unknown, trim = true): v is string => {
  return typeof v === 'string' && (trim ? v.trim() : v).length > 0;
};
