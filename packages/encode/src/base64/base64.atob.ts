import { __httpx_encode_base64_cache } from "../cache/__httpx_encode_base64_cache.ts";
import {
  decodeUtf8,
  formatBase64Output,
  prepareBase64Input,
} from "./base64-helpers";
import type {
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64.types";

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/77383580#77383580

function base64ToBytes(base64: string, options?: Base64DecodeOptions) {
  // atob() only accepts the standard alphabet and does not support the
  // decode options, validate and normalize the input upfront
  const binString = globalThis.atob(prepareBase64Input(base64, options));
  const { length } = binString;
  // A plain loop is ~20x faster than Uint8Array.from(binString, callback)
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

// Max arguments passed to String.fromCharCode at once, stays well below
// engine call stack / argument limits
const chunkSize = 0x1000;

function bytesToBase64(bytes: Uint8Array) {
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(
      String.fromCharCode.apply(
        null,
        bytes.subarray(i, i + chunkSize) as unknown as number[]
      )
    );
  }
  return globalThis.btoa(chunks.join(""));
}

export const Base64Atob = {
  /**
   * Encode a string (utf-8) to base64.
   *
   * @example
   * ```typescript
   * Base64Atob.encode("🌸"); // "8J+MuA=="
   * Base64Atob.encode("🌸", { alphabet: "base64url" }); // "8J-MuA=="
   * Base64Atob.encode("🌸", { omitPadding: true }); // "8J+MuA"
   * Base64Atob.encode("🌸", { alphabet: "base64url", omitPadding: true }); // "8J-MuA"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  encode: (input: string, options?: Base64EncodeOptions): string =>
    formatBase64Output(
      bytesToBase64(__httpx_encode_base64_cache.utf8TextEncoder.encode(input)),
      options
    ),
  /**
   * Decode a base64 (or base64url) string to a string (utf-8).
   *
   * @example
   * ```typescript
   * Base64Atob.decode("8J+MuA=="); // "🌸"
   * Base64Atob.decode("8J-MuA"); // "🌸" (base64url and missing padding accepted)
   * Base64Atob.decode("8J+MuA==", { alphabet: "base64url" }); // throws
   * Base64Atob.decode("Zm9vYg", { lastChunkHandling: "strict" }); // throws
   * Base64Atob.decode("Zm9vYg", { lastChunkHandling: "stop-before-partial" }); // "foo"
   * Base64Atob.decode("/w=="); // "\uFFFD" (0xff is not valid utf-8)
   * Base64Atob.decode("/w==", { fatal: true }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options,
   * or when `fatal` is true and the decoded bytes are not valid utf-8
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal
   */
  decode: (input: string, options?: Base64DecodeTextOptions): string =>
    decodeUtf8(base64ToBytes(input, options), options),
  /**
   * Encode bytes to base64.
   *
   * @example
   * ```typescript
   * Base64Atob.fromUint8Array(new Uint8Array([0xfb, 0xff])); // "+/8="
   * Base64Atob.fromUint8Array(new Uint8Array([0xfb, 0xff]), { alphabet: "base64url" }); // "-_8="
   * Base64Atob.fromUint8Array(new Uint8Array([0xfb, 0xff]), { omitPadding: true }); // "+/8"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  fromUint8Array: (bytes: Uint8Array, options?: Base64EncodeOptions): string =>
    formatBase64Output(bytesToBase64(bytes), options),
  /**
   * Decode a base64 (or base64url) string to bytes.
   *
   * @example
   * ```typescript
   * Base64Atob.toUint8Array("+/8="); // Uint8Array [0xfb, 0xff]
   * Base64Atob.toUint8Array("-_8"); // Uint8Array [0xfb, 0xff] (base64url and missing padding accepted)
   * Base64Atob.toUint8Array("-_8=", { alphabet: "base64" }); // throws
   * Base64Atob.toUint8Array("+/8", { lastChunkHandling: "strict" }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   */
  toUint8Array: (input: string, options?: Base64DecodeOptions): Uint8Array =>
    base64ToBytes(input, options),
} as const satisfies Base64Encoder;
