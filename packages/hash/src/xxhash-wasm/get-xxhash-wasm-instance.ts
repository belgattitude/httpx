import type { XXHashAPI } from 'xxhash-wasm';

declare global {
  // eslint-disable-next-line no-var
  var xxhashInstance: XXHashAPI | null | undefined;
}

globalThis.xxhashInstance ??= null;

let initPromise: Promise<XXHashAPI> | null = null;

export const getXXHashWasmInstance = async (): Promise<XXHashAPI> => {
  if (globalThis.xxhashInstance) {
    return globalThis.xxhashInstance;
  }
  if (initPromise) {
    return initPromise;
  }
  initPromise = import('xxhash-wasm')
    .then((mod) => mod.default())
    .catch((e) => {
      initPromise = null;
      const msg = `xxhash-wasm module failed to load, did you forget to install it? (${(e as Error).message})`;
      throw new Error(msg);
    });
  globalThis.xxhashInstance = await initPromise;
  initPromise = null;
  return globalThis.xxhashInstance;
};
