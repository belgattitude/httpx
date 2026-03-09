import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: "import { md5 } from '@httpx/md5'",
    path: ['dist/index.mjs'],
    import: '{ md5 }',
    limit: '1250B',
  },
  {
    name: "import { md5 } from '@httpx/md5/nodejs'",
    path: ['dist/nodejs/index.mjs'],
    import: '{ md5 }',
    limit: '110B',
    modifyEsbuildConfig: (config) => {
      config.platform = 'node';
      return config;
    }
  },

] satisfies SizeLimitConfig;
