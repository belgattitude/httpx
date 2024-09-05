import { getTypeInfo } from './getTypeInfo';

export const errPfx = 'Value is expected to be';
const vowelsAndH = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'h']);
export const formatErrMsg = (
  msg: string,
  v: unknown,
  options?: {
    pfx: boolean;
  }
): string => {
  const { pfx = true } = options ?? {};
  const aOrAn = vowelsAndH.has((msg?.[0] ?? '').toLowerCase()) ? 'an' : 'a';
  return `${pfx ? `${errPfx} ${aOrAn} ` : ''}${msg}, got: ${getTypeInfo(v)}`;
};
