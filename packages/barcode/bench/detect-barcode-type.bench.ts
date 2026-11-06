import { describe, test } from "vitest";

import { benchOptions } from "./bench-options";
import { getBarcodeSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { detectBarcodeType } = await getBarcode();
const codes = getBarcodeSeeds(1000);
const noTrim = { trim: false } as const;

describe(`detectBarcodeType() - ${codes.length} mixed codes`, () => {
  test(`detectBarcodeType() - ${codes.length} mixed codes`, async ({
    bench,
  }) => {
    await bench.compare(
      bench("@httpx/barcode - detectBarcodeType(v)", () => {
        for (const code of codes) {
          detectBarcodeType(code);
        }
      }),
      bench("@httpx/barcode - detectBarcodeType(v, { trim: false })", () => {
        for (const code of codes) {
          detectBarcodeType(code, noTrim);
        }
      }),
      benchOptions
    );
  });
});
