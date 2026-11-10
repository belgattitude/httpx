import { describe, test } from "vitest";

import { createMIntl } from "../src";
import { benchConfig } from "./bench.config";

const intl = createMIntl();
const nbRows = benchConfig.samples;
describe(`createMIntl NumberFormatter benchmarks (${nbRows} instances)`, () => {
  const arrayMapperScenario = Array.from({ length: nbRows }).map((_v, idx) => {
    return {
      productId: idx,
      price: idx + 0.99,
      currency: idx % 2 === 0 ? "USD" : "EUR",
      locale: idx % 2 === 0 ? "en-US" : "fr-FR",
    };
  });

  test("memoized vs not memoized", async ({ bench }) => {
    await bench.compare(
      bench("With memoization `intl.NumberFormatter()`", () => {
        for (const row of arrayMapperScenario) {
          intl
            .NumberFormat(row.locale, {
              style: "currency",
              currency: row.currency,
              notation: "compact",
              minimumFractionDigits: 2,
            })
            .format(row.price);
        }
      }),
      bench("Without memoization `new Intl.NumberFormatter()`", () => {
        for (const row of arrayMapperScenario) {
          new Intl.NumberFormat(row.locale, {
            style: "currency",
            currency: row.currency,
            notation: "compact",
            minimumFractionDigits: 2,
          }).format(row.price);
        }
      }),
      benchConfig.benchOptions
    );
  });
});
