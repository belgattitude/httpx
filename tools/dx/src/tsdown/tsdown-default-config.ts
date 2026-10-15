import { createTsdownConfig } from "./create-tsdown-config.ts";

/**
 * tsdown base for node packages: esm only, `node22` target.
 */
export const tsdownDefaultConfig = createTsdownConfig({ browserslist: false });
