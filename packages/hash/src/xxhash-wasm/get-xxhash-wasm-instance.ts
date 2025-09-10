import type { XXHashAPI } from 'xxhash-wasm';

let instance: XXHashAPI | null = null;

export const getXXHashWasmInstance = async (): Promise<XXHashAPI> => {
  instance ??= await import('xxhash-wasm')
    .then((mod) => {
      return mod.default();
    })
    .catch((e) => {
      const msg = `xxhash-wasm module failed to load, did you forget to install it? (${(e as Error).message})`;
      throw new Error(msg);
    });
  return instance;
};
