import { bench } from 'vitest';

import { MIntl } from '../src';
import { benchConfig } from './bench.config';
const nbRows = benchConfig.samples;
describe(`MIntl Locale benchmarks (${nbRows} instances)`, () => {
  const arr = Array.from({ length: nbRows }).map((_v, idx) => ({
    idx: idx,
  }));

  bench(
    'With memoization `MIntl.Locale()`',
    () => {
      for (const _row of arr) {
        const locale = MIntl.Locale('fr-FR', {
          caseFirst: 'lower',
        });
        const _language = locale.language;
      }
    },
    { time: 1 }
  );

  bench(
    'Without memoization `new Intl.Locale()`',
    () => {
      for (const _row of arr) {
        const locale = new Intl.Locale('fr-FR', {
          caseFirst: 'lower',
        });
        const _language = locale.language;
      }
    },
    { time: 1 }
  );
});
