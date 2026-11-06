import { describe, test } from "vitest";

import { benchOptions } from "./bench-options";
import { getBarcodeSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { detectBarcodeType } = await getBarcode();
const codes = getBarcodeSeeds(1000);

describe(`detectBarcodeType() - ${codes.length} mixed codes`, () => {
  test(`detectBarcodeType() - ${codes.length} mixed codes`, async ({
    bench,
  }) => {
    await bench("@httpx/barcode - detectBarcodeType", () => {
      for (const code of codes) {
        detectBarcodeType(code);
      }
    }).run(benchOptions);
  });
});
