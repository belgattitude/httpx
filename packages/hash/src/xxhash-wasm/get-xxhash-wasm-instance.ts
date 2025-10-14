import type { XXHashAPI } from 'xxhash-wasm';

declare global {
  // eslint-disable-next-line no-var
  var xxhashInstance: XXHashAPI | null | undefined;
}

globalThis.xxhashInstance ??= null;

export const getXXHashWasmInstance = async (): Promise<XXHashAPI> => {
  globalThis.xxhashInstance ??= await import('xxhash-wasm')
    .then((mod) => mod.default())
    .catch((e) => {
      const msg = `xxhash-wasm module failed to load, did you forget to install it? (${(e as Error).message})`;
      throw new Error(msg);
    });

  // Type assertion to ensure correct return type
  return globalThis.xxhashInstance;
};
