import type { SizeLimitConfig } from 'size-limit';

const config = [
  {
    name: 'import { XMemCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ XMemCache }',
    limit: '1200B',
  },
  {
    name: 'import { TimeLruCache } (ESM)',
    path: ['dist/index.js'],
    import: '{ TimeLruCache }',
    limit: '710B',
  },
] satisfies SizeLimitConfig;

export default config;