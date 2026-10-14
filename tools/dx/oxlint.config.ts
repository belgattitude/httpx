import { defineConfig } from "oxlint";

import { oxlintDefaultConfig } from "./src/index.ts";

export default defineConfig({
  extends: [oxlintDefaultConfig],
});
