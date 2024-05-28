import { bench } from 'vitest';

const nbRows = 10_000;

describe(`MIntl - mapping over ${nbRows} rows.`, async () => {
  const arrayMapperScenario = Array.from({ length: nbRows }).map((_v, idx) => ({
    productId: idx,
    price: idx + 0.99,
    currency: idx % 2 === 0 ? 'USD' : 'EUR',
    locale: idx % 2 === 0 ? 'en-US' : 'fr-FR',
  }));

  const MIntl = await import('@httpx/memo-intl')
    .then((mod) => mod.MIntl)
    .catch((_e) => {
      throw new Error(
        'Comparative benchmarks requires httpx/memo-intl to be built (yarn build)'
      );
    });

  bench('With memoization `MIntl.NumberFormatter()`', () => {
    for (const row of arrayMapperScenario) {
      MIntl.NumberFormat(row.locale, {
        style: 'currency',
        currency: row.currency,
        notation: 'compact',
        minimumFractionDigits: 2,
      }).format(row.price);
    }
  });

  bench('Without memoization `new Intl.NumberFormatter()`', () => {
    for (const row of arrayMapperScenario) {
      new Intl.NumberFormat(row.locale, {
        style: 'currency',
        currency: row.currency,
        notation: 'compact',
        minimumFractionDigits: 2,
      }).format(row.price);
    }
  });
});
