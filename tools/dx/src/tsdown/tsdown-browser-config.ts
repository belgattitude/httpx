import { createTsdownConfig } from "./create-tsdown-config.ts";

/**
 * tsdown base for packages also running in browsers: the default base with the
 * browsers of the package `.browserslistrc` added to the `node22` target.
 */
export const tsdownBrowserConfig = createTsdownConfig({ browserslist: true });
