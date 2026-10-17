import { getJsBase64, hasNativeBase64 } from "./base64/base64.select";
import type { Base64Encoder } from "./base64/base64.types";
import { Base64Uint8Array } from "./base64/base64.uint8array";

/**
 * Picks the fastest implementation for the detected runtime features
 * (see bench/, 11 kB utf-8 string), Buffer is not considered:
 *
 * 1. Uint8Array.fromBase64 / toBase64: native, 2-3x faster in browsers.
 * 2. Otherwise pure js encode and atob() decode.
 */
export const Base64: Base64Encoder = hasNativeBase64()
  ? Base64Uint8Array
  : getJsBase64();

export type {
  Base64Alphabet,
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64/base64.types";
