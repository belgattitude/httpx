import { bench } from 'vitest';

import { MIntl } from '../src';
import { benchConfig } from './bench.config';

const nbRows = benchConfig.samples;
describe(`MIntl NumberFormatter benchmarks (${nbRows} instances)`, () => {
  const arrayMapperScenario = Array.from({ length: nbRows }).map((_v, idx) => ({
    productId: idx,
    price: idx + 0.99,
    currency: idx % 2 === 0 ? 'USD' : 'EUR',
    locale: idx % 2 === 0 ? 'en-US' : 'fr-FR',
  }));

  bench(
    'With memoization `MIntl.NumberFormatter()`',
    () => {
      for (const row of arrayMapperScenario) {
        MIntl.NumberFormat(row.locale, {
          style: 'currency',
          currency: row.currency,
          notation: 'compact',
          minimumFractionDigits: 2,
        }).format(row.price);
      }
    },
    benchConfig.benchOptions
  );

  bench(
    'Without memoization `new Intl.NumberFormatter()`',
    () => {
      for (const row of arrayMapperScenario) {
        new Intl.NumberFormat(row.locale, {
          style: 'currency',
          currency: row.currency,
          notation: 'compact',
          minimumFractionDigits: 2,
        }).format(row.price);
      }
    },
    benchConfig.benchOptions
  );
});
