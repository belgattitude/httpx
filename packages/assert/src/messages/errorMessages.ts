import { getTypeInfo } from './getTypeInfo';

export const errPfx = 'Value is expected to be';
const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
export const formatErrMsg = (
  msg: string,
  v: unknown,
  options?: {
    pfx: boolean;
  }
): string => {
  const { pfx = true } = options ?? {};
  return `${
    pfx
      ? `${errPfx} ${vowels.has((msg?.[0] ?? '').toLowerCase()) ? 'an' : 'a'} `
      : ''
  }${msg}, got: ${getTypeInfo(v)}`;
};
