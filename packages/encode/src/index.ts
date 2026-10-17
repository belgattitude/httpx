import { Base64Node20 } from "./base64/base64.node20";
import { getJsBase64, hasNativeBase64 } from "./base64/base64.select";
import type { Base64Encoder } from "./base64/base64.types";
import { Base64Uint8Array } from "./base64/base64.uint8array";

/**
 * Picks the fastest implementation for the detected runtime features
 * (see bench/, 11 kB utf-8 string):
 *
 * 1. Uint8Array.fromBase64 / toBase64: native, fastest or on par everywhere.
 * 2. Buffer (node < 25): ~1.5x faster than the js alternatives.
 * 3. Otherwise pure js encode and atob() decode.
 */
const getFastestBase64 = (): Base64Encoder => {
  if (hasNativeBase64()) {
    return Base64Uint8Array;
  }
  if (typeof globalThis.Buffer === "function") {
    return Base64Node20;
  }
  return getJsBase64();
};

export const Base64: Base64Encoder = getFastestBase64();

export type {
  Base64Alphabet,
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64/base64.types";
