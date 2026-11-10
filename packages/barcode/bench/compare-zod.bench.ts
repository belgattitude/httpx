import { describe, test } from "vitest";
import * as z from "zod";

import { devDependencies } from "../package.json" with { type: "json" };
import { benchOptions } from "./bench-options";
import { getBarcodeSeeds } from "./bench-seeds";
import { getBarcode } from "./get-barcode";

const { isGtin } = await getBarcode();
const codes = getBarcodeSeeds(1000);

/**
 * Zod has no GTIN validator: equivalent schema as a user would write it
 * (digits and length regexp, check digit refinement).
 */
const hasValidCheckDigit = (code: string): boolean => {
  let sum = 0;
  for (let i = code.length - 2, w = 3; i >= 0; i--, w = 4 - w) {
    sum += Number(code[i]) * w;
  }
  return (10 - (sum % 10)) % 10 === Number(code.at(-1));
};

const zodGtinSchema = z
  .string()
  .regex(/^(?:\d{8}|\d{12,14})$/)
  .refine((code) => hasValidCheckDigit(code));

// strict: throws if zod can't compile the schema (instead of silently
// returning the runtime parser)
const zodCompiledGtinSchema = z.compile(zodGtinSchema, { strict: true });

/** Zod schema delegating the validation to @httpx/barcode (zod overhead only) */
const zodIsGtinSchema = z.compile(
  z.string().refine((v) => isGtin(v)),
  { strict: true }
);

const validCodes = codes.filter((code) => isGtin(code));

// sanity: all implementations must agree before being compared
for (const code of codes) {
  const expected = isGtin(code);
  if (
    zodGtinSchema.safeParse(code).success !== expected ||
    zodCompiledGtinSchema.safeParse(code).success !== expected ||
    zodIsGtinSchema.safeParse(code).success !== expected
  ) {
    throw new Error(`Implementations disagree on "${code}"`);
  }
}

const scenarios = [
  { name: `${codes.length} mixed codes (~20% invalid)`, values: codes },
  { name: `${validCodes.length} valid codes`, values: validCodes },
];

describe.each(scenarios)("Compare with zod - $name", ({ name, values }) => {
  test(`isGtin vs zod - ${name}`, async ({ bench }) => {
    await bench.compare(
      bench("@httpx/barcode - isGtin(v)", () => {
        for (const value of values) {
          isGtin(value);
        }
      }),
      bench(`zod@${devDependencies.zod} - schema.safeParse(v)`, () => {
        for (const value of values) {
          zodGtinSchema.safeParse(value);
        }
      }),
      bench(`zod@${devDependencies.zod} - z.compile(schema).safeParse(v)`, () => {
        for (const value of values) {
          zodCompiledGtinSchema.safeParse(value);
        }
      }),
      bench(`zod@${devDependencies.zod} - z.compile(z.string().refine((v) => isGtin(v)))`, () => {
        for (const value of values) {
          zodIsGtinSchema.safeParse(value);
        }
      }),
      benchOptions
    );
  });
});
