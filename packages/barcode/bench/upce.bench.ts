import { describe, test } from "vitest";

import { benchOptions } from "./bench-options";
import { getBarcodeSeeds, getEightDigitSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { detectBarcodeType, expandUpcE, isEan8, isUpcE, parseGtin } =
  await getBarcode();

const codes = getEightDigitSeeds(1000);
// overhead of the options on codes of every length (mostly ean13)
const mixedCodes = getBarcodeSeeds(1000);

const upce = { upce: true } as const;
const preferUpce = { upce: "prefer-upce" } as const;
const preferEan8 = { upce: "prefer-ean8" } as const;
const formats = { formats: ["ean13", "upca"] } as const;

// sanity: the seeds must exercise both readings, and prefer-upce must agree
// with the guards (UPC-E when valid and starting with 0, EAN-8 otherwise).
// In-store EAN-8 (restricted circulation) are valid EAN-8.
const counts = { ean8: 0, upce: 0, invalid: 0 };
for (const code of codes) {
  let expected: "ean8" | "upce" | null = null;
  if (code.startsWith("0") && isUpcE(code)) {
    expected = "upce";
  } else if (isEan8(code)) {
    expected = "ean8";
  }
  counts[expected ?? "invalid"]++;
  const parsed = parseGtin(code, preferUpce);
  if (
    detectBarcodeType(code, preferUpce) !== expected ||
    (parsed.success ? parsed.format : null) !== expected
  ) {
    throw new Error(
      `upce: "prefer-upce" disagrees with the guards on "${code}"`
    );
  }
}
if (counts.ean8 < 300 || counts.upce < 300 || counts.invalid === 0) {
  throw new Error(`Unbalanced seeds: ${JSON.stringify(counts)}`);
}

const name = `${codes.length} 8 digit strings (EAN-8 and UPC-E)`;

describe(`UPC-E - ${name}`, () => {
  test(`parseGtin upce - ${name}`, async ({ bench }) => {
    await bench.compare(
      bench("parseGtin(v)", () => {
        for (const code of codes) {
          parseGtin(code);
        }
      }),
      bench("parseGtin(v, { upce: true })", () => {
        for (const code of codes) {
          parseGtin(code, upce);
        }
      }),
      bench('parseGtin(v, { upce: "prefer-upce" })', () => {
        for (const code of codes) {
          parseGtin(code, preferUpce);
        }
      }),
      bench('parseGtin(v, { upce: "prefer-ean8" })', () => {
        for (const code of codes) {
          parseGtin(code, preferEan8);
        }
      }),
      benchOptions
    );
  });

  test(`parseGtin options - ${mixedCodes.length} mixed strings`, async ({
    bench,
  }) => {
    await bench.compare(
      bench("parseGtin(v)", () => {
        for (const code of mixedCodes) {
          parseGtin(code);
        }
      }),
      bench('parseGtin(v, { upce: "prefer-upce" })', () => {
        for (const code of mixedCodes) {
          parseGtin(code, preferUpce);
        }
      }),
      bench("parseGtin(v, { formats })", () => {
        for (const code of mixedCodes) {
          parseGtin(code, formats);
        }
      }),
      benchOptions
    );
  });

  test(`detectBarcodeType upce - ${name}`, async ({ bench }) => {
    await bench.compare(
      bench("detectBarcodeType(v)", () => {
        for (const code of codes) {
          detectBarcodeType(code);
        }
      }),
      bench("detectBarcodeType(v, { upce: true })", () => {
        for (const code of codes) {
          detectBarcodeType(code, upce);
        }
      }),
      bench('detectBarcodeType(v, { upce: "prefer-upce" })', () => {
        for (const code of codes) {
          detectBarcodeType(code, preferUpce);
        }
      }),
      bench('detectBarcodeType(v, { upce: "prefer-ean8" })', () => {
        for (const code of codes) {
          detectBarcodeType(code, preferEan8);
        }
      }),
      bench("isUpcE(v)", () => {
        for (const code of codes) {
          isUpcE(code);
        }
      }),
      bench("expandUpcE(v)", () => {
        for (const code of codes) {
          expandUpcE(code);
        }
      }),
      benchOptions
    );
  });
});
