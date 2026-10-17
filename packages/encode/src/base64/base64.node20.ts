// import { Buffer } from 'node:buffer';

import { __httpx_encode_base64_cache } from "../cache/__httpx_encode_base64_cache.ts";
import {
  decodeUtf8,
  formatBase64Output,
  fromBase64Native,
  prepareBase64Input,
} from "./base64-helpers";
import type {
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64.types";

// Buffer.from(input, 'base64') never throws: it silently skips characters
// outside of the base64 / base64url alphabets, which can produce corrupted
// output (ie: 'SGV$bG8=' decodes to 'He[\x1b').
// Uint8Array.fromBase64 (node 25+) validates natively, older versions
// need to check the input upfront.
const isUint8ArrayBase64Supported = typeof Uint8Array.fromBase64 === "function";

const base64ToBuffer = isUint8ArrayBase64Supported
  ? (input: string, options?: Base64DecodeOptions): Buffer => {
      const bytes = fromBase64Native(input, options);
      return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.length);
    }
  : (input: string, options?: Base64DecodeOptions): Buffer =>
      Buffer.from(prepareBase64Input(input, options), "base64");

// On node 25+, TextEncoder + toBase64() is ~30% faster than Buffer and
// supports the options natively
const stringToBase64 = isUint8ArrayBase64Supported
  ? (input: string, options?: Base64EncodeOptions): string =>
      __httpx_encode_base64_cache.utf8TextEncoder
        .encode(input)
        .toBase64(options)
  : (input: string, options?: Base64EncodeOptions): string =>
      formatBase64Output(
        Buffer.from(input, "utf8").toString("base64"),
        options
      );

const bytesToBase64 = isUint8ArrayBase64Supported
  ? (bytes: Uint8Array, options?: Base64EncodeOptions): string =>
      bytes.toBase64(options)
  : (bytes: Uint8Array, options?: Base64EncodeOptions): string =>
      formatBase64Output(
        Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString(
          "base64"
        ),
        options
      );

// Returns a plain Uint8Array: small Buffers are slices of a shared memory
// pool, exposing their `.buffer` would leak (and allow to corrupt) the
// other allocations. Pooled buffers are small, the copy is cheap.
const bufferToUint8Array = (buffer: Buffer): Uint8Array =>
  buffer.byteLength === buffer.buffer.byteLength
    ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    : new Uint8Array(buffer);

export const Base64Node20 = {
  /**
   * Encode a string (utf-8) to base64.
   *
   * @example
   * ```typescript
   * Base64Node20.encode("🌸"); // "8J+MuA=="
   * Base64Node20.encode("🌸", { alphabet: "base64url" }); // "8J-MuA=="
   * Base64Node20.encode("🌸", { omitPadding: true }); // "8J+MuA"
   * Base64Node20.encode("🌸", { alphabet: "base64url", omitPadding: true }); // "8J-MuA"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  encode: (input: string, options?: Base64EncodeOptions): string =>
    stringToBase64(input, options),

  /**
   * Decode a base64 (or base64url) string to a string (utf-8).
   *
   * @example
   * ```typescript
   * Base64Node20.decode("8J+MuA=="); // "🌸"
   * Base64Node20.decode("8J-MuA"); // "🌸" (base64url and missing padding accepted)
   * Base64Node20.decode("8J+MuA==", { alphabet: "base64url" }); // throws
   * Base64Node20.decode("Zm9vYg", { lastChunkHandling: "strict" }); // throws
   * Base64Node20.decode("Zm9vYg", { lastChunkHandling: "stop-before-partial" }); // "foo"
   * Base64Node20.decode("/w=="); // "\uFFFD" (0xff is not valid utf-8)
   * Base64Node20.decode("/w==", { fatal: true }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options,
   * or when `fatal` is true and the decoded bytes are not valid utf-8
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal
   */
  decode: (input: string, options?: Base64DecodeTextOptions): string => {
    const buffer = base64ToBuffer(input, options);
    // Buffer#toString has no fatal mode
    return options?.fatal === true
      ? decodeUtf8(buffer, options)
      : buffer.toString("utf8");
  },
  /**
   * Encode bytes to base64.
   *
   * @example
   * ```typescript
   * Base64Node20.fromUint8Array(new Uint8Array([0xfb, 0xff])); // "+/8="
   * Base64Node20.fromUint8Array(new Uint8Array([0xfb, 0xff]), { alphabet: "base64url" }); // "-_8="
   * Base64Node20.fromUint8Array(new Uint8Array([0xfb, 0xff]), { omitPadding: true }); // "+/8"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  fromUint8Array: (bytes: Uint8Array, options?: Base64EncodeOptions): string =>
    bytesToBase64(bytes, options),
  /**
   * Decode a base64 (or base64url) string to bytes.
   *
   * @example
   * ```typescript
   * Base64Node20.toUint8Array("+/8="); // Uint8Array [0xfb, 0xff]
   * Base64Node20.toUint8Array("-_8"); // Uint8Array [0xfb, 0xff] (base64url and missing padding accepted)
   * Base64Node20.toUint8Array("-_8=", { alphabet: "base64" }); // throws
   * Base64Node20.toUint8Array("+/8", { lastChunkHandling: "strict" }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   */
  toUint8Array: isUint8ArrayBase64Supported
    ? fromBase64Native
    : (input: string, options?: Base64DecodeOptions): Uint8Array =>
        bufferToUint8Array(base64ToBuffer(input, options)),
} as const satisfies Base64Encoder;
