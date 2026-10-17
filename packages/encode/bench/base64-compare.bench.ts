import { Base64 } from "@httpx/encode";
import * as jsBase64 from "js-base64";
import prettyBytes from "pretty-bytes";
import {
  base64ToString,
  base64ToUint8Array,
  stringToBase64,
  uint8ArrayToBase64,
} from "uint8array-extras";
import { describe, test } from "vitest";

import { benchConfig } from "./bench-config";

// `Base64` picks the fastest implementation for the runtime
describe("Base64 compared to js-base64 and uint8array-extras", () => {
  const { benchOptions, longString, longBytes } = benchConfig;
  const size = prettyBytes(longString.length);
  const bytesSize = prettyBytes(longBytes.length);
  const encoded = Base64.encode(longString);
  const encodedBytes = Base64.fromUint8Array(longBytes);

  test(`encode (original size: ${size})`, async ({ bench }) => {
    await bench.compare(
      bench("@httpx/encode Base64.encode()", () => {
        Base64.encode(longString);
      }),
      bench("npm:js-base64 encode()", () => {
        jsBase64.encode(longString);
      }),
      bench("npm:uint8array-extras stringToBase64()", () => {
        stringToBase64(longString);
      }),
      benchOptions
    );
  });

  test(`decode (original size: ${size})`, async ({ bench }) => {
    await bench.compare(
      bench("@httpx/encode Base64.decode()", () => {
        Base64.decode(encoded);
      }),
      bench("npm:js-base64 decode()", () => {
        jsBase64.decode(encoded);
      }),
      bench("npm:uint8array-extras base64ToString()", () => {
        base64ToString(encoded);
      }),
      benchOptions
    );
  });

  test(`fromUint8Array (original size: ${bytesSize})`, async ({ bench }) => {
    await bench.compare(
      bench("@httpx/encode Base64.fromUint8Array()", () => {
        Base64.fromUint8Array(longBytes);
      }),
      bench("npm:js-base64 fromUint8Array()", () => {
        jsBase64.fromUint8Array(longBytes);
      }),
      bench("npm:uint8array-extras uint8ArrayToBase64()", () => {
        uint8ArrayToBase64(longBytes);
      }),
      benchOptions
    );
  });

  test(`toUint8Array (original size: ${bytesSize})`, async ({ bench }) => {
    await bench.compare(
      bench("@httpx/encode Base64.toUint8Array()", () => {
        Base64.toUint8Array(encodedBytes);
      }),
      bench("npm:js-base64 toUint8Array()", () => {
        jsBase64.toUint8Array(encodedBytes);
      }),
      bench("npm:uint8array-extras base64ToUint8Array()", () => {
        base64ToUint8Array(encodedBytes);
      }),
      benchOptions
    );
  });
});
