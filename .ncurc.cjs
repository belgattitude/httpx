// @ts-check

const { defineConfig } = require('npm-check-updates');

// @todo read the content from .yarnrc.yml
const npmPreapprovedPackagesPrefixes = [
  '@belgattitude/',
  '@flowblade/',
  '@httpx/',
];

module.exports = defineConfig({
  workspaces: true,
  mergeConfig: true,
  root: true,
  packageManager: 'yarn',
  cooldown: (packageName) => {
    if (
      npmPreapprovedPackagesPrefixes.some((prefix) =>
        packageName.startsWith(prefix)
      )
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
    'nextra-theme-docs',
  ],
});
