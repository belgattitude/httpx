import { bench } from 'vitest';

import { MIntl } from '../src';

describe('MIntl Locale benchmarks', () => {
  const nbRows = 100;
  const arr = Array.from({ length: nbRows }).map((_v, idx) => ({
    idx: idx,
  }));

  bench(
    'With memoization `MIntl.Loclae()`',
    () => {
      for (const _row of arr) {
        const _locale = MIntl.Locale('fr-FR', {
          caseFirst: 'lower',
        });
      }
    },
    { time: 1 }
  );

  bench(
    'Without memoization `new Intl.Locale()`',
    () => {
      for (const _row of arr) {
        const _rtf = new Intl.Locale('fr_FR', {
          caseFirst: 'lower',
        });
      }
    },
    { time: 1 }
  );
});
