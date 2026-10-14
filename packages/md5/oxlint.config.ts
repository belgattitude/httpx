import { oxlintDefaultConfig } from "@httpx/dx";
import { defineConfig } from "@httpx/dx/oxlint";

export default defineConfig({
  extends: [oxlintDefaultConfig],
  ignorePatterns: ["**/_release", "**/docs"],
  overrides: [
    {
      // Low-level md5 port: 32-bit bitwise math, utf-16 code units and indexed typed tuples are intended (must stay bit-exact)
      files: ["src/ecmascript/md5-ecmascript.ts"],
      rules: {
        "no-bitwise": "off",
        "unicorn/prefer-math-trunc": "off",
        "unicorn/prefer-code-point": "off",
        "prefer-destructuring": "off",
        "no-param-reassign": "off",
        "typescript/no-non-null-assertion": "off",
      },
    },
  ],
});
