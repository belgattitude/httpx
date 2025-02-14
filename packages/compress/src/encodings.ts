import type { SupportedEncodings } from './types';

export const supportedEncodings = [
  'gzip',
  'deflate',
] as const satisfies SupportedEncodings[];
