import path from "node:path";

export const monorepoConfig = {
  root: path.resolve(import.meta.dirname, "..", "..", ".."),
} as const;
