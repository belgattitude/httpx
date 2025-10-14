import type { XXHashAPI } from 'xxhash-wasm';

declare global {
  // eslint-disable-next-line no-var
  var xxhashInstance: XXHashAPI | null | undefined;
  // eslint-disable-next-line no-var
  var xxhashInstancePromise: Promise<XXHashAPI> | null | undefined;
}

globalThis.xxhashInstance ??= null;
globalThis.xxhashInstancePromise ??= null;

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
    return globalThis.xxhashInstancePromise;
  }
  globalThis.xxhashInstancePromise = import('xxhash-wasm')
    .then((mod) => mod.default())
    .catch((e) => {
      globalThis.xxhashInstancePromise = null;
      const msg = `xxhash-wasm module failed to load, did you forget to install it? (${(e as Error).message})`;
      throw new Error(msg);
    });
  globalThis.xxhashInstance = await globalThis.xxhashInstancePromise;
  globalThis.xxhashInstancePromise = null;
  return globalThis.xxhashInstance;
};
