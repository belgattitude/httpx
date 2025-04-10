import { bench } from 'vitest';

import { MIntl } from '../src';

describe('MIntl DateFormatter benchmarks', () => {
  const nbRows = 100;
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
    { time: 1 }
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
    { time: 1 }
  );
});
