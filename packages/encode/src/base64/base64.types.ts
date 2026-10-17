/**
 * - `"base64"`: standard alphabet, uses `+` and `/` (RFC 4648 §4)
 * - `"base64url"`: URL and filename safe alphabet, uses `-` and `_` (RFC 4648 §5)
 */
export type Base64Alphabet = "base64" | "base64url";

/**
 * Encoding options, same as `Uint8Array.prototype.toBase64()`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#options
 */
export interface Base64EncodeOptions {
  /**
   * Alphabet used to encode.
   *
   * - `"base64"` (default): standard alphabet, uses `+` and `/` (RFC 4648 §4)
   * - `"base64url"`: URL and filename safe alphabet, uses `-` and `_` (RFC 4648 §5)
   *
   * @default "base64"
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#alphabet
   */
  alphabet?: Base64Alphabet;
  /**
   * Omit the trailing `=` padding characters.
   *
   * @default false
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64#omitpadding
   */
  omitPadding?: boolean;
}

/**
 * Decoding options, same as `Uint8Array.fromBase64()`.
 *
 * Note: whitespace (space, tab, line feed, form feed, carriage return) is
 * always ignored.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#options
 */
export interface Base64DecodeOptions {
  /**
   * Alphabet accepted when decoding.
   *
   * - `undefined` (default): accepts both base64 and base64url characters,
   *   even mixed. Differs from `Uint8Array.fromBase64()` that defaults to
   *   `"base64"`.
   * - `"base64"`: only the standard alphabet, `-` and `_` are rejected
   * - `"base64url"`: only the URL safe alphabet, `+` and `/` are rejected
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#alphabet
   */
  alphabet?: Base64Alphabet;
  /**
   * How to handle the last chunk when it has less than 4 characters.
   *
   * - `"loose"` (default): the padding is optional, ie: `"Zm9vYg"` or
   *   `"Zm9vYg=="` decode to `"foob"`. A single dangling character throws.
   * - `"strict"`: the padding is required and the unused bits of the last
   *   character must be zero, ie: `"Zm9vYg"` and `"Zm9vYh=="` throw.
   * - `"stop-before-partial"`: a last chunk that is not complete (missing or
   *   incomplete padding) is ignored, ie: `"Zm9vYg"` decodes to `"foo"`.
   *
   * @default "loose"
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64#lastchunkhandling
   */
  lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
}

/**
 * Options for decode(), the base64 decoding options plus how to handle
 * decoded bytes that are not valid utf-8.
 */
export interface Base64DecodeTextOptions extends Base64DecodeOptions {
  /**
   * Throw when the decoded bytes are not valid utf-8, instead of replacing
   * the invalid sequences with U+FFFD (�).
   *
   * Use it to detect binary data or a wrong encoding. For binary data, use
   * `toUint8Array()` instead of `decode()`.
   *
   * @default false
   * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/fatal
   */
  fatal?: boolean;
}

export interface Base64Encoder {
  /** Encode a string (utf-8) to base64 */
  encode: (input: string, options?: Base64EncodeOptions) => string;
  /** Decode a base64 string to a string (utf-8) */
  decode: (input: string, options?: Base64DecodeTextOptions) => string;
  /** Encode bytes to base64 */
  fromUint8Array: (bytes: Uint8Array, options?: Base64EncodeOptions) => string;
  /** Decode a base64 string to bytes */
  toUint8Array: (
    input: string,
    options?: Base64DecodeOptions
  ) => Uint8Array<ArrayBuffer>;
}
