import { describe, test } from "vitest";

import { benchOptions } from "./bench-options";
import { getBarcodeSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { createGtinParser, normalizeGtin, parseGtin, parseGtinOrThrow } =
  await getBarcode();

const codes = getBarcodeSeeds(1000);
// same codes stored as numbers (leading zeros lost, non digit ones dropped)
const numbers = codes.filter((c) => /^\d+$/.test(c)).map(Number);
const validCodes = codes.filter((c) => normalizeGtin(c) !== null);

const options = {
  types: ["ean13", "upca"],
  inputTypes: ["string", "number"],
} as const;

const noTrim = { trim: false } as const;

const parser = createGtinParser(options);

// sanity: parseGtin must agree with normalizeGtin before being compared
for (const value of [...codes, ...numbers]) {
  const result = parseGtin(value);
  if ((result.success ? result.gtin : null) !== normalizeGtin(value)) {
    throw new Error(`parseGtin and normalizeGtin disagree on "${value}"`);
  }
}

const scenarios = [
  { name: `${codes.length} mixed strings (~20% invalid)`, values: codes },
  { name: `${validCodes.length} valid strings`, values: validCodes },
  { name: `${numbers.length} mixed numbers`, values: numbers },
];

describe.each(scenarios)("parseGtin - $name", ({ name, values }) => {
  test(`parseGtin vs normalizeGtin - ${name}`, async ({ bench }) => {
    await bench.compare(
      bench("normalizeGtin(v)", () => {
        for (const value of values) {
          normalizeGtin(value);
        }
      }),
      bench("parseGtin(v)", () => {
        for (const value of values) {
          parseGtin(value);
        }
      }),
      bench("parseGtin(v, { trim: false })", () => {
        for (const value of values) {
          parseGtin(value, noTrim);
        }
      }),
      bench("parseGtin(v, { types, inputTypes })", () => {
        for (const value of values) {
          parseGtin(value, options);
        }
      }),
      bench("createGtinParser({ types, inputTypes }).parse(v)", () => {
        for (const value of values) {
          parser.parse(value);
        }
      }),
      bench("try { parseGtinOrThrow(v) } catch {}", () => {
        for (const value of values) {
          try {
            parseGtinOrThrow(value);
          } catch {
            // invalid
          }
        }
      }),
      benchOptions
    );
  });
});
