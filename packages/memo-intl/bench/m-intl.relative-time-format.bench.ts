import { bench } from 'vitest';

import { MIntl } from '../src';
import { benchConfig } from './bench.config';

const nbRows = benchConfig.samples;

describe(`MIntl RelativeTimeFormat benchmarks (${nbRows} instances)`, () => {
  const dates = Array.from({ length: nbRows }).map((_v, idx) => ({
    idx: idx,
  }));

  bench(
    'With memoization `MIntl.RelativeTimeFormat()`',
    () => {
      for (const row of dates) {
        const rtf = MIntl.RelativeTimeFormat('en', {
          localeMatcher: 'best fit',
          numeric: 'always',
          style: 'long',
        });
        rtf.format(row.idx, 'day');
      }
    },
    { time: 1 }
  );

  bench(
    'Without memoization `new Intl.RelativeTimeFormat()`',
    () => {
      for (const row of dates) {
        const rtf = new Intl.RelativeTimeFormat('en', {
          localeMatcher: 'best fit',
          numeric: 'always',
          style: 'long',
        });
        rtf.format(row.idx, 'day');
      }
    },
    { time: 1 }
  );
});
