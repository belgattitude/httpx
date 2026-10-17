import { Base64Atob } from "./base64.atob";
import { Base64Purejs } from "./base64.purejs";
import type { Base64Encoder } from "./base64.types";

/**
 * Whether Uint8Array.fromBase64 / toBase64 are available (node 25+, bun,
 * deno, chrome 140+, firefox 133+, safari 18.2+).
 */
export const hasNativeBase64 = (): boolean =>
  typeof Uint8Array.fromBase64 === "function" &&
  typeof Uint8Array.prototype.toBase64 === "function";

/**
 * Fastest combination when neither the native base64 nor Buffer are
 * available (see bench/): the pure js encoder is ~1.6x faster than btoa(),
 * atob() decodes ~1.2x faster than pure js.
 */
export const getJsBase64 = (): Base64Encoder => {
  const decoder =
    typeof globalThis.atob === "function" ? Base64Atob : Base64Purejs;
  return {
    encode: Base64Purejs.encode,
    fromUint8Array: Base64Purejs.fromUint8Array,
    decode: decoder.decode,
    toUint8Array: decoder.toUint8Array,
  };
};
