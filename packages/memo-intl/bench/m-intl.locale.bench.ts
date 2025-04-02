import { bench } from 'vitest';

import { MIntl } from '../src';

describe('MIntl Locale benchmarks', () => {
  const nbRows = 10_000;

  bench(
    'With memoization `MIntl.Locale()`',
    () => {
      for (let i = 0; i < nbRows; i++) {
        const _locale = MIntl.Locale('en');
      }
    },
    { time: 1 }
  );

  bench(
    'Without memoization `new Intl.Locale()`',
    () => {
      for (let i = 0; i < nbRows; i++) {
        const _locale = new Intl.Locale('en');
      }
    },
    { time: 1 }
  );
});
