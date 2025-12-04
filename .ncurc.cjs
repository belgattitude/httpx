// @ts-check

const { defineConfig } = require('npm-check-updates');

// @todo read the content from .yarnrc.yml
const npmPreapprovedPackages = [
  '@belgattitude/*',
  '@flowblade/*',
  '@httpx/*',
  'hono',
  'vite',
  '@vitejs/*',
  "vitest",
  "@vitest/*",
  'esbuild',
  '@esbuild/*',
  'tsup',
  'prettier',
  '@typescript-eslint/*',
  'next',
  '@next/*'
];

module.exports = defineConfig({
  workspaces: true,
  mergeConfig: true,
  root: true,
  packageManager: 'yarn',
  cooldown: (packageName) => {
    if (
      npmPreapprovedPackages.some((allowed) =>
      {
        if (allowed.endsWith('/*')) {
          return packageName.startsWith(allowed.slice(0, -1));
        } else {
          return packageName === allowed;
        }
      })
    ) {
      return 0;
    }
    return 3;
  },
  reject: [
    // Cause v9 isn't yet supported
    'eslint',
    // Till documentation website is upgraded
    'nextra',
    'nextra-theme-docs'
  ],
});
