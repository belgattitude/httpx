import { isEan13, isUuidV4, type UuidV4 } from '@httpx/assert';

export const checkEan13 = (v: unknown): boolean => {
  return isEan13(v);
};

export const testTypeExports = (v: unknown): UuidV4 | null => {
  if (isUuidV4(v)) {
    return v;
  }
  return null;
};
