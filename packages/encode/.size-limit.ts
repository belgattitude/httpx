import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: 'Only { Base64 } (index)',
    path: ['dist/index.js'],
    module: true,
    import: '{ Base64 }',
    limit: '1800B',
  },
  {
    name: 'Only { Base64 } (purejs)',
    path: ['dist/base64/base64.purejs.js'],
    import: '{ Base64Purejs }',
    limit: '400B',
  },
  {
    name: 'Only { Base64 } (nodejs)',
    path: ['dist/base64/base64.nodejs.js'],
    import: '{ Base64NodeJs }',
    limit: '75B',
  },
  {
    name: 'Only { Base64 } (browser)',
    path: ['dist/base64/base64.browser.js'],
    import: '{ Base64Browser }',
    limit: '230B',
  },

] satisfies SizeLimitConfig;
