import { createEscheckConfig } from "./create-escheck-config.ts";

/**
 * es-check base for node packages: the files in `dist` use es2022 syntax only.
 */
export const escheckDefaultConfig = createEscheckConfig({
  browserslist: false,
});
