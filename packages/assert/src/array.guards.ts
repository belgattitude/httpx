import type { ArrayNonEmpty } from "./array.types";

export const isArrayNonEmpty = <T = unknown>(
  v: unknown
): v is ArrayNonEmpty<T> => Array.isArray(v) && v.length > 0;
