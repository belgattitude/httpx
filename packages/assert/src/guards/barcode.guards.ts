import type { Ean13 } from '../types';

export const isEan13 = (v: unknown): v is Ean13 => {
  if (typeof v !== 'string' || v.length !== 13) {
    return false;
  }
  const sum = v
    .slice(0, 12)
    .split('')
    .map((n, i) => Number(n) * (i % 2 ? 3 : 1))
    .reduce((sum, n) => sum + n, 0);
  return Math.ceil(sum / 10) * 10 - sum === Number(v[12]);
};
