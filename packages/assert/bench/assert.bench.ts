import { bench, describe } from 'vitest';

import { isParsableStrictIsoDateZ } from '../src';

/**
 * Based on a hypothesis:
 */
const realLifeScenarios = [
  ...Array.from({ length: 10 }).map((_) => new Date().toISOString()), // Pass
  ...Array.from({ length: 10 }).fill('2100-13-29T25:37:31.653Z'), // Une date pas correct 25h
  ...Array.from({ length: 10 }).fill('2100-12-29T28:37:31.653Z'), // Une date pas correct 25h
  ...Array.from({ length: 10 }).fill('2010-12-27T00:37:31.653Z'), // Une date pas correct 25h
  ...Array.from({ length: 10 }).fill(''),
];

describe(`Compare calling ${realLifeScenarios.length}x i with mixed types values`, async () => {
  bench(
    'test',
    () => {
      for (const value of realLifeScenarios) {
        const _v8 = isParsableStrictIsoDateZ(value);
      }
    },
    { time: 1 }
  );
});
