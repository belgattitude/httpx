import { bench, describe } from 'vitest';

describe('isPlainObject', async () => {
  const realLifeScenarios = [
    ...Array.from({ length: 70 }).map((_) => ({ a: Math.random() })),
    ...Array.from({ length: 10 }).fill(new Map()),
    ...Array.from({ length: 5 }).fill(null),
    // eslint-disable-next-line unicorn/no-useless-undefined
    ...Array.from({ length: 5 }).fill(undefined),
    ...Array.from({ length: 10 }).fill('str'),
  ];

  const httpxIsPlainObject = await import('@httpx/assert').then(
    (mod) => mod.isPlainObject
  );
  const is = await import('@sindresorhus/is').then((mod) => mod.default);
  const isPlainObj = await import('is-plain-obj').then((mod) => mod.default);
  const lodash = await import('lodash-es').then((mod) => mod.default);
  const moderndash = await import('moderndash').then(
    (mod) => mod.isPlainObject
  );

  bench('@httpx/assert:    `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = httpxIsPlainObject(value);
    }
  });

  bench('@sindresorhus/is: `is.plainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = is.plainObject(value);
    }
  });

  bench('is-plain-obj: `isPlainObj(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = isPlainObj(value);
    }
  });

  bench.skip('(not compliant !) moderndash: `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = moderndash(value);
    }
  });

  bench('lodash-es: `_.isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = lodash.isPlainObject(value);
    }
  });
});
