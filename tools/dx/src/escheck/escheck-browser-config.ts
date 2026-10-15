import { createEscheckConfig } from "./create-escheck-config.ts";

/**
 * es-check base for packages also running in browsers: the files in `dist` use the
 * ES version supported by the browsers of the package `.browserslistrc`.
 */
export const escheckBrowserConfig = createEscheckConfig({ browserslist: true });
