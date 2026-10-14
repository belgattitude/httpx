import type { XXHashAPI } from "xxhash-wasm";

declare global {
  var xxhashInstance: XXHashAPI | null | undefined;
  var xxhashInstancePromise: Promise<XXHashAPI> | null | undefined;
}

globalThis.xxhashInstance ??= null;
globalThis.xxhashInstancePromise ??= null;

const loadXXHashAPI = async (): Promise<XXHashAPI> => {
  try {
    const mod = await import("xxhash-wasm");
    return await mod.default();
  } catch (error) {
    globalThis.xxhashInstancePromise = null;
    const msg = `xxhash-wasm module failed to load, did you forget to install it? (${error instanceof Error ? error.message : String(error)})`;
    throw new Error(msg, { cause: error });
  }
};

/**
 * Load and return a singleton instance of the `xxhash-wasm` module.
 *
 * This function ensures that the `xxhash-wasm` module is only loaded once,
 * even if called multiple times. It uses global variables (globalThis) to store
 * the `XXHashApi` instance.
 */
export const getXXHashAPI = async (): Promise<XXHashAPI> => {
  if (globalThis.xxhashInstance) {
    return globalThis.xxhashInstance;
  }
  if (globalThis.xxhashInstancePromise) {
    return await globalThis.xxhashInstancePromise;
  }
  globalThis.xxhashInstancePromise = loadXXHashAPI();
  globalThis.xxhashInstance = await globalThis.xxhashInstancePromise;
  globalThis.xxhashInstancePromise = null;
  return globalThis.xxhashInstance;
};
