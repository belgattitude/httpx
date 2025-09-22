import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'import { CookieStore } (ESM)',
    path: ['dist/index.mjs'],
    import: '{ CookieStore }',
    limit: '900B',
  },
] satisfies SizeLimitConfig;
