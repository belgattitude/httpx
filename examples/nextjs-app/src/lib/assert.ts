import { isEan13 } from '@httpx/assert';

export const checkEan13 = (v: unknown): boolean => {
  return isEan13(v);
};
