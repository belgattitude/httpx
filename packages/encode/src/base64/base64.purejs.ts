import { __httpx_encode_base64_cache } from "../cache/__httpx_encode_base64_cache.ts";
import { base64Alphabet, base64UrlAlphabet } from "./base64-alphabet";
import { decodeUtf8, prepareBase64Input } from "./base64-helpers";
import type {
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
  Base64Encoder,
} from "./base64.types";

// Char codes of the alphabets, the output is written as bytes in a
// Uint8Array and converted to a string once (much faster than string
// concatenation)
const toCharCodes = (alphabet: string): Uint8Array =>
  Uint8Array.from(alphabet, (char) => char.charCodeAt(0));
const base64Codes = toCharCodes(base64Alphabet);
const base64UrlCodes = toCharCodes(base64UrlAlphabet);
const paddingCode = 61; // "="

// Char code to sextet lookup table, the input is validated and normalized
// to the standard alphabet before decoding
const lookup = new Uint8Array(128);
for (let i = 0; i < base64Alphabet.length; i++) {
  lookup[base64Alphabet.charCodeAt(i)] = i;
}

const bytesToBase64 = (
  bytes: Uint8Array,
  options?: Base64EncodeOptions
): string => {
  const codes =
    options?.alphabet === "base64url" ? base64UrlCodes : base64Codes;
  const omitPadding = options?.omitPadding === true;
  const { length } = bytes;
  const remainder = length % 3;
  const fullLength = length - remainder;
  const output = new Uint8Array(
    omitPadding ? Math.ceil((length * 4) / 3) : Math.ceil(length / 3) * 4
  );
  let j = 0;
  let i = 0;

  for (; i < fullLength; i += 3) {
    const chunk =
      ((bytes[i] as number) << 16) |
      ((bytes[i + 1] as number) << 8) |
      (bytes[i + 2] as number);
    output[j++] = codes[chunk >> 18] as number;
    output[j++] = codes[(chunk >> 12) & 0x3f] as number;
    output[j++] = codes[(chunk >> 6) & 0x3f] as number;
    output[j++] = codes[chunk & 0x3f] as number;
  }

  if (remainder > 0) {
    const chunk =
      ((bytes[i] as number) << 16) |
      (remainder === 2 ? (bytes[i + 1] as number) << 8 : 0);
    output[j++] = codes[chunk >> 18] as number;
    output[j++] = codes[(chunk >> 12) & 0x3f] as number;
    if (remainder === 2) {
      output[j++] = codes[(chunk >> 6) & 0x3f] as number;
    }
    if (!omitPadding) {
      output.fill(paddingCode, j);
    }
  }

  // The output only contains ascii characters, valid utf-8
  return __httpx_encode_base64_cache.utf8TextDecoder.decode(output);
};

const base64ToBytes = (
  input: string,
  options?: Base64DecodeOptions
): Uint8Array => {
  // Validated, without whitespace / padding, standard alphabet
  const data = prepareBase64Input(input, options);
  const { length } = data;
  const remainder = length % 4;
  const fullLength = length - remainder;
  const output = new Uint8Array((length * 3) >> 2);
  let j = 0;
  let i = 0;

  for (; i < fullLength; i += 4) {
    const chunk =
      ((lookup[data.charCodeAt(i)] as number) << 18) |
      ((lookup[data.charCodeAt(i + 1)] as number) << 12) |
      ((lookup[data.charCodeAt(i + 2)] as number) << 6) |
      (lookup[data.charCodeAt(i + 3)] as number);
    output[j++] = chunk >> 16;
    output[j++] = (chunk >> 8) & 0xff;
    output[j++] = chunk & 0xff;
  }

  // remainder is 0, 2 or 3 (validated)
  if (remainder > 0) {
    const chunk =
      ((lookup[data.charCodeAt(i)] as number) << 18) |
      ((lookup[data.charCodeAt(i + 1)] as number) << 12) |
      (remainder === 3 ? (lookup[data.charCodeAt(i + 2)] as number) << 6 : 0);
    output[j++] = chunk >> 16;
    if (remainder === 3) {
      output[j] = (chunk >> 8) & 0xff;
    }
  }

  return output;
};

export const Base64Purejs = {
  /**
   * Encode a string (utf-8) to base64.
   *
   * @example
   * ```typescript
   * Base64Purejs.encode("🌸"); // "8J+MuA=="
   * Base64Purejs.encode("🌸", { alphabet: "base64url" }); // "8J-MuA=="
   * Base64Purejs.encode("🌸", { omitPadding: true }); // "8J+MuA"
   * Base64Purejs.encode("🌸", { alphabet: "base64url", omitPadding: true }); // "8J-MuA"
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
   */
  encode: (input: string, options?: Base64EncodeOptions): string =>
    bytesToBase64(
      __httpx_encode_base64_cache.utf8TextEncoder.encode(input),
      options
    ),

  /**
   * Decode a base64 (or base64url) string to a string (utf-8).
   *
   * @example
   * ```typescript
   * Base64Purejs.decode("8J+MuA=="); // "🌸"
   * Base64Purejs.decode("8J-MuA"); // "🌸" (base64url and missing padding accepted)
   * Base64Purejs.decode("8J+MuA==", { alphabet: "base64url" }); // throws
   * Base64Purejs.decode("Zm9vYg", { lastChunkHandling: "strict" }); // throws
   * Base64Purejs.decode("Zm9vYg", { lastChunkHandling: "stop-before-partial" }); // "foo"
   * Base64Purejs.decode("/w=="); // "\uFFFD" (0xff is not valid utf-8)
   * Base64Purejs.decode("/w==", { fatal: true }); // throws
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
   * Base64Purejs.fromUint8Array(new Uint8Array([0xfb, 0xff])); // "+/8="
   * Base64Purejs.fromUint8Array(new Uint8Array([0xfb, 0xff]), { alphabet: "base64url" }); // "-_8="
   * Base64Purejs.fromUint8Array(new Uint8Array([0xfb, 0xff]), { omitPadding: true }); // "+/8"
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
   * Base64Purejs.toUint8Array("+/8="); // Uint8Array [0xfb, 0xff]
   * Base64Purejs.toUint8Array("-_8"); // Uint8Array [0xfb, 0xff] (base64url and missing padding accepted)
   * Base64Purejs.toUint8Array("-_8=", { alphabet: "base64" }); // throws
   * Base64Purejs.toUint8Array("+/8", { lastChunkHandling: "strict" }); // throws
   * ```
   *
   * @throws Error when the input is not valid base64 according to the options
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
   */
  toUint8Array: (input: string, options?: Base64DecodeOptions): Uint8Array =>
    base64ToBytes(input, options),
} as const satisfies Base64Encoder;
