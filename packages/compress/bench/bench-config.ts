import { vitestBenchOptionsConfig } from "@httpx/devtools-vitest";
import prettyBytes from "pretty-bytes";

import { Compressor, Decompressor } from "../src";

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

/**
 * Deterministic PRNG (Park-Miller), the generated text is the same on each run
 */
const createPrng = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 16_807) % 2_147_483_647;
    return (state - 1) / 2_147_483_646;
  };
};

// oxfmt-ignore
const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "the", "quick", "brown",
  "fox", "jumps", "over", "lazy", "dog", "abcdef", "012345", "-",
  "😊", "🦄", "éàù", "naïve", "café", "€uro", "Ωmega", "Ā", "文字",
];

/**
 * Pseudo random text made of words and numbers. Unlike a repeated string it
 * compresses ~3x (gzip), like real world text, so the base64 encoding runs on
 * a compressed payload of meaningful size (~1MB locally).
 */
const createText = (length: number): string => {
  const random = createPrng(42);
  const parts: string[] = [];
  let size = 0;
  while (size < length) {
    const part = `${words[Math.floor(random() * words.length)]}${random() < 0.1 ? "\n" : " "}${random() < 0.3 ? Math.floor(random() * 1e6) : ""}`;
    parts.push(part);
    size += part.length;
  }
  return parts.join("").slice(0, length);
};

const longString = createText(isCiOrCodSpeed ? 10_000 : 3_000_000);

const gzipCompressor = new Compressor("gzip");
const deflateCompressor = new Compressor("deflate");

const gzipped = await gzipCompressor.toUint8Array(longString);
const deflated = await deflateCompressor.toUint8Array(longString);

export const benchConfig = {
  gzipCompressor,
  deflateCompressor,
  gzipDecompressor: new Decompressor("gzip"),
  deflateDecompressor: new Decompressor("deflate"),
  longString,
  /** pre-compressed fixtures for the decompressor benches */
  compressed: {
    gzip: {
      uint8Array: gzipped,
      base64: await gzipCompressor.toEncodedString(longString),
      base64UrlSafe: await gzipCompressor.toEncodedString(longString, {
        encoding: "base64_urlsafe",
      }),
    },
    deflate: {
      uint8Array: deflated,
      base64: await deflateCompressor.toEncodedString(longString),
      base64UrlSafe: await deflateCompressor.toEncodedString(longString, {
        encoding: "base64_urlsafe",
      }),
    },
  },
  /** utf-8 byte sizes, used in the bench names */
  sizes: {
    original: prettyBytes(new TextEncoder().encode(longString).byteLength),
    gzip: prettyBytes(gzipped.byteLength),
    deflate: prettyBytes(deflated.byteLength),
  },
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 4,
  },
} as const;
