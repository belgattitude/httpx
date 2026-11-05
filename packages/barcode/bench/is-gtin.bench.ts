import { describe, test } from "vitest";

import { benchOptions } from "./bench-options";
import { getBarcodeSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { isGtin } = await getBarcode();
const codes = getBarcodeSeeds(1000);

describe(`isGtin() - ${codes.length} mixed codes`, () => {
  test(`isGtin() - ${codes.length} mixed codes`, async ({ bench }) => {
    await bench("@httpx/barcode - isGtin", () => {
      for (const code of codes) {
        isGtin(code);
      }
    }).run(benchOptions);
  });
});
