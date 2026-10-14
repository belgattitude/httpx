// @ts-check

const { defineConfig } = require("npm-check-updates");

// @todo read the content from .yarnrc.yml
const npmPreapprovedPackages = [
  "npm-check-updates",
  "@belgattitude/*",
  "@flowblade/*",
  "@httpx/*",
  "hono",
  "vite",
  "@vitejs/*",
  "vitest",
  "@vitest/*",
  "esbuild",
  "@esbuild/*",
  "tsdown",
  "prettier",
  "@typescript-eslint/*",
  "next",
  "@next/*",
  "@cloudflare/*",
  "size-limit",
  "@size-limit/*",
];

module.exports = defineConfig({
  workspaces: true,
  mergeConfig: true,
  root: true,
  packageManager: "yarn",
  cooldown: (packageName) => {
    if (
      npmPreapprovedPackages.some((allowed) => {
        if (allowed.endsWith("/*")) {
          return packageName.startsWith(allowed.slice(0, -1));
        } else {
          return packageName === allowed;
        }
      })
    ) {
      return 0;
    }
    return 2;
  },
  reject: [
    "primereact",
    // Till documentation website is upgraded
    "nextra",
    "nextra-theme-docs",
  ],
});
