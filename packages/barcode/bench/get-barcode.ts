import type * as BarcodeSources from "../src";

/**
 * Load the built files (`pnpm build`), not `../src` nor the `@httpx/barcode`
 * package name (resolved to the sources by the `httpx-monorepo-source`
 * condition): vitest runs the sources through the vite module runner, where
 * every internal import is a getter that adds overhead to the measures.
 * @link https://vitest.dev/guide/benchmarking#module-runner-overhead
 *
 * Destructure the result in the bench file (`const { fn } = await
 * getBarcode()`): calling an imported binding (ie: `export const { fn }`
 * re-exported from here) also goes through a getter on each call, which
 * measured ~2x slower on node.
 */
// Not a literal: typescript doesn't resolve (nor typecheck against) a dist that
// may be missing or outdated
const distPath = "../dist/index.js";

export const getBarcode = async (): Promise<typeof BarcodeSources> => {
  try {
    return (await import(distPath)) as typeof BarcodeSources;
  } catch (error: unknown) {
    throw new Error(
      "The benchmarks require @httpx/barcode to be built (pnpm build)",
      { cause: error }
    );
  }
};
