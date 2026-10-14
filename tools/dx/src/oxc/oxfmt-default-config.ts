import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

import { defaultIgnorePatterns } from "./default-ignore-patterns.ts";

const { ignorePatterns: _ignorePatterns, ...restUltracite } = ultracite;

export const oxfmtDefaultConfig = defineConfig({
  ...restUltracite,
  ignorePatterns: [
    ...defaultIgnorePatterns,
    "docs/**/*.md",
    // because changesets generates it on release
    "CHANGELOG.md",
  ],
  sortPackageJson: {
    sortScripts: true,
  },
});
