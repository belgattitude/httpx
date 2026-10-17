import type { Base64Encoder } from "@httpx/encode";
import { Base64Atob } from "@httpx/encode/base64/base64.atob";
import { Base64Node20 } from "@httpx/encode/base64/base64.node20";
import { Base64Purejs } from "@httpx/encode/base64/base64.purejs";
import { Base64Uint8Array } from "@httpx/encode/base64/base64.uint8array";
import prettyBytes from "pretty-bytes";
import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

// Uint8Array.fromBase64 / toBase64 requires node 25+, bun, deno or recent browsers
const isUint8ArrayBase64Supported = typeof Uint8Array.fromBase64 === "function";

const implementations: [name: string, encoder: Base64Encoder][] = [
  ["node20 (Buffer)", Base64Node20],
  ["purejs", Base64Purejs],
  ["atob", Base64Atob],
  ...(isUint8ArrayBase64Supported
    ? [["uint8array (native)", Base64Uint8Array] as [string, Base64Encoder]]
    : []),
];

describe("Base64 implementations", () => {
  const { benchOptions, longString, longBytes } = benchConfig;
  const size = prettyBytes(longString.length);
  const bytesSize = prettyBytes(longBytes.length);
  const encoded = Base64Purejs.encode(longString);
  const encodedBytes = Base64Purejs.fromUint8Array(longBytes);

  test(`encode (original size: ${size})`, async ({ bench }) => {
    await bench.compare(
      ...implementations.map(([name, encoder]) =>
        bench(`@httpx/encode ${name}.encode()`, () => {
          encoder.encode(longString);
        })
      ),
      benchOptions
    );
  });

  test(`decode (original size: ${size})`, async ({ bench }) => {
    await bench.compare(
      ...implementations.map(([name, encoder]) =>
        bench(`@httpx/encode ${name}.decode()`, () => {
          encoder.decode(encoded);
        })
      ),
      benchOptions
    );
  });

  test(`fromUint8Array (original size: ${bytesSize})`, async ({ bench }) => {
    await bench.compare(
      ...implementations.map(([name, encoder]) =>
        bench(`@httpx/encode ${name}.fromUint8Array()`, () => {
          encoder.fromUint8Array(longBytes);
        })
      ),
      benchOptions
    );
  });

  test(`toUint8Array (original size: ${bytesSize})`, async ({ bench }) => {
    await bench.compare(
      ...implementations.map(([name, encoder]) =>
        bench(`@httpx/encode ${name}.toUint8Array()`, () => {
          encoder.toUint8Array(encodedBytes);
        })
      ),
      benchOptions
    );
  });
});
