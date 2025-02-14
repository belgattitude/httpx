import type { SupportedEncodings } from './types';

export type CompressorOptions = {
  encoding: SupportedEncodings;
};

export interface AsyncCompressor {
  toUint8Array: <T extends string | Uint8Array>(data: T) => Promise<Uint8Array>;
  toString: <T extends string | Uint8Array>(data: T) => Promise<string>;

  fromUint8Array: <T extends string | Uint8Array>(
    data: Uint8Array
  ) => Promise<T>;
}
