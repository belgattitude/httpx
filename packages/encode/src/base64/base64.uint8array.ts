import { __httpx_encode_base64_cache } from "../cache/__httpx_encode_base64_cache.ts";
import { decodeUtf8, fromBase64Native } from "./base64-helpers";
import type {
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64.types";

// Relies on Uint8Array.fromBase64() / Uint8Array.prototype.toBase64()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
// Supported in Chrome 140+, Firefox 133+, Safari 18.2+, Node.js 25+, Bun, Deno

export const Base64Uint8Array = {
  /**
   * Encode a string (utf-8) to base64.
   *
   * @example
   * ```typescript
   * Base64Uint8Array.encode("🌸"); // "8J+MuA=="
   * Base64Uint8Array.encode("🌸", { alphabet: "base64url" }); // "8J-MuA=="
   * Base64Uint8Array.encode("🌸", { omitPadding: true }); // "8J+MuA"
   * Base64Uint8Array.encode("🌸", { alphabet: "base64url", omitPadding: true }); // "8J-MuA"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  encode: (input: string, options?: Base64EncodeOptions): string =>
    __httpx_encode_base64_cache.utf8TextEncoder.encode(input).toBase64(options),
  /**
   * Decode a base64 (or base64url) string to a string (utf-8).
   *
   * @example
   * ```typescript
   * Base64Uint8Array.decode("8J+MuA=="); // "🌸"
   * Base64Uint8Array.decode("8J-MuA"); // "🌸" (base64url and missing padding accepted)
   * Base64Uint8Array.decode("8J+MuA==", { alphabet: "base64url" }); // throws
   * Base64Uint8Array.decode("Zm9vYg", { lastChunkHandling: "strict" }); // throws
   * Base64Uint8Array.decode("Zm9vYg", { lastChunkHandling: "stop-before-partial" }); // "foo"
   * Base64Uint8Array.decode("/w=="); // "\uFFFD" (0xff is not valid utf-8)
   * Base64Uint8Array.decode("/w==", { fatal: true }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options,
   * or when `fatal` is true and the decoded bytes are not valid utf-8
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal
   */
  decode: (input: string, options?: Base64DecodeTextOptions): string =>
    decodeUtf8(fromBase64Native(input, options), options),
  /**
   * Encode bytes to base64.
   *
   * @example
   * ```typescript
   * Base64Uint8Array.fromUint8Array(new Uint8Array([0xfb, 0xff])); // "+/8="
   * Base64Uint8Array.fromUint8Array(new Uint8Array([0xfb, 0xff]), { alphabet: "base64url" }); // "-_8="
   * Base64Uint8Array.fromUint8Array(new Uint8Array([0xfb, 0xff]), { omitPadding: true }); // "+/8"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  fromUint8Array: (bytes: Uint8Array, options?: Base64EncodeOptions): string =>
    bytes.toBase64(options),
  /**
   * Decode a base64 (or base64url) string to bytes.
   *
   * @example
   * ```typescript
   * Base64Uint8Array.toUint8Array("+/8="); // Uint8Array [0xfb, 0xff]
   * Base64Uint8Array.toUint8Array("-_8"); // Uint8Array [0xfb, 0xff] (base64url and missing padding accepted)
   * Base64Uint8Array.toUint8Array("-_8=", { alphabet: "base64" }); // throws
   * Base64Uint8Array.toUint8Array("+/8", { lastChunkHandling: "strict" }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   */
  toUint8Array: (
    input: string,
    options?: Base64DecodeOptions
  ): Uint8Array<ArrayBuffer> => fromBase64Native(input, options),
} as const satisfies Base64Encoder;
