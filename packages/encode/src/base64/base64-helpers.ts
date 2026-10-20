import { __httpx_encode_base64_cache } from "../cache/__httpx_encode_base64_cache.ts";
import { base64Alphabet } from "./base64-alphabet";
import type {
  Base64DecodeOptions,
  Base64DecodeTextOptions,
  Base64EncodeOptions,
} from "./base64.types";

// ASCII whitespace, the ones skipped by Uint8Array.fromBase64
const whitespaceRegexp = /[\t\n\f\r ]/g;
const charsRegexps = {
  any: /^[\w+/-]*={0,2}$/,
  base64: /^[\d+/A-Za-z]*={0,2}$/,
  base64url: /^[\w-]*={0,2}$/,
} as const;

export const invalidBase64Error = (reason: string, cause?: unknown): Error =>
  new Error(
    `Invalid Base64 input: ${reason}`,
    cause === undefined ? {} : { cause }
  );

/**
 * Applies the encode options to a padded, standard alphabet, base64 string.
 */
export const formatBase64Output = (
  base64: string,
  options?: Base64EncodeOptions
): string => {
  let output =
    options?.omitPadding === true ? base64.replace(/[=]{1,2}$/, "") : base64;
  if (options?.alphabet === "base64url") {
    output = output.replaceAll("+", "-").replaceAll("/", "_");
  }
  return output;
};

/**
 * Validates the input with the same rules as Uint8Array.fromBase64 and
 * returns the data to decode: standard alphabet, without whitespace or
 * padding. The result is safe to pass to lenient decoders (Buffer, atob...).
 *
 * @throws Error when the input is not valid base64
 */
export const prepareBase64Input = (
  input: string,
  options?: Base64DecodeOptions
): string => {
  const alphabet = options?.alphabet;
  const lastChunkHandling = options?.lastChunkHandling ?? "loose";
  const charsRegexp = charsRegexps[alphabet ?? "any"];
  let compact = input;
  if (!charsRegexp.test(input)) {
    // slow path, the input may contain whitespace (ie: MIME line breaks)
    compact = input.replaceAll(whitespaceRegexp, "");
    if (compact === input || !charsRegexp.test(compact)) {
      throw invalidBase64Error("invalid character found");
    }
  }
  if (alphabet !== "base64") {
    compact = compact.replaceAll("-", "+").replaceAll("_", "/");
  }
  // the regexp guarantees at most 2 trailing '='
  const data = compact.replace(/[=]{1,2}$/, "");
  const padding = compact.length - data.length;
  const remainder = data.length % 4;
  const withoutLastChunk = (): string => data.slice(0, -remainder);

  if (padding === 0) {
    if (remainder === 0) {
      return data;
    }
    if (lastChunkHandling === "stop-before-partial") {
      return withoutLastChunk();
    }
    if (remainder === 1 || lastChunkHandling === "strict") {
      throw invalidBase64Error("incomplete last chunk, padding is missing");
    }
    return data;
  }

  if (remainder < 2 || (remainder === 3 && padding === 2)) {
    throw invalidBase64Error("unexpected padding");
  }
  if (remainder === 2 && padding === 1) {
    // ie: "Zm9vYg=", the second padding character is missing
    if (lastChunkHandling === "stop-before-partial") {
      return withoutLastChunk();
    }
    throw invalidBase64Error("incomplete padding");
  }
  if (lastChunkHandling === "strict") {
    const last = base64Alphabet.indexOf(data.at(-1) ?? "");
    // the 4 (or 2) low bits of the last character are not part of the output
    if (last % (remainder === 2 ? 16 : 4) !== 0) {
      throw invalidBase64Error("non-zero padding bits");
    }
  }
  return data;
};

/**
 * Decodes with the native Uint8Array.fromBase64 (node 25+, bun, deno,
 * recent browsers).
 *
 * @throws Error when the input is not valid base64
 */
export const fromBase64Native = (
  input: string,
  options?: Base64DecodeOptions
): Uint8Array<ArrayBuffer> => {
  try {
    const alphabet = options?.alphabet;
    return Uint8Array.fromBase64(
      // fromBase64() only accepts one alphabet at a time, accept both
      // when no alphabet is specified
      alphabet === undefined
        ? input.replaceAll("-", "+").replaceAll("_", "/")
        : input,
      {
        alphabet: alphabet ?? "base64",
        lastChunkHandling: options?.lastChunkHandling ?? "loose",
      }
    );
  } catch (error) {
    throw invalidBase64Error(
      error instanceof Error ? error.message : String(error),
      error
    );
  }
};

// Created on first use, most callers never need it
let fatalUtf8TextDecoder: TextDecoder | undefined;

/**
 * Decodes utf-8 bytes, with the `fatal` option: invalid sequences throw
 * instead of being replaced by U+FFFD. A leading BOM is always kept.
 *
 * @throws Error when `fatal` is true and the bytes are not valid utf-8
 */
export const decodeUtf8 = (
  bytes: Uint8Array,
  options?: Base64DecodeTextOptions
): string => {
  if (options?.fatal !== true) {
    return __httpx_encode_base64_cache.utf8TextDecoder.decode(bytes);
  }
  fatalUtf8TextDecoder ??= new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: true,
  });
  try {
    return fatalUtf8TextDecoder.decode(bytes);
  } catch (error) {
    throw new Error("Invalid UTF-8: the decoded data is not valid utf-8", {
      cause: error,
    });
  }
};
