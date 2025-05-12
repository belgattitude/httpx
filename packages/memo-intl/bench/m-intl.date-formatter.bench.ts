import { bench } from 'vitest';

import { MIntl } from '../src';
import { benchConfig } from './bench.config';
const nbRows = benchConfig.samples;
describe(`MIntl DateFormatter benchmarks (${nbRows} instances)`, () => {
  const dates = Array.from({ length: nbRows }).map((_v, idx) => ({
    date: 10_000 + idx,
  }));

  bench(
    'With memoization `MIntl.DateFormatter()`',
    () => {
      for (const row of dates) {
        const formatter = MIntl.DateTimeFormat('fr-FR', {
          dateStyle: 'full',
          timeStyle: 'full',
          timeZone: 'UTC',
        });
        formatter.format(new Date(row.date));
      }
    },
    benchConfig.benchOptions
  );

  bench(
    'Without memoization `new Intl.DateFormatter()`',
    () => {
      for (const row of dates) {
        const formatter = new Intl.DateTimeFormat('fr-FR', {
          dateStyle: 'full',
          timeStyle: 'full',
          timeZone: 'UTC',
        });
        formatter.format(new Date(row.date));
      }
    },
    benchConfig.benchOptions
  );
});
