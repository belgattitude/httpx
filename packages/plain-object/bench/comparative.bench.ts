import { bench, describe } from 'vitest';

/**
 * Based on a hypothesis:
 * `isPlainObject` is called 70% of the time with valid plain objects,
 * 10% with maps, 10% with nulls, 5% with undefined and 5% with string.
 */
const realLifeScenarios = [
  // 70% plain object
  ...Array.from({ length: 70 }).map((_) => ({
    key1: Math.random(),
    key2: Math.random(),
    key3: Math.random(),
  })),
  // Others: not plain objects
  ...Array.from({ length: 10 }).fill(new Map([['key', Math.random()]])),
  ...Array.from({ length: 10 }).fill(null),
  // eslint-disable-next-line unicorn/no-useless-undefined
  ...Array.from({ length: 5 }).fill(undefined),
  ...Array.from({ length: 5 }).fill('str'),
] as const;

describe(`Compare calling isPlainObject with ${realLifeScenarios.length}x mixed types values`, async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const httpxIsPlainObject: (_v: unknown) => boolean = await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    '@httpx/plain-object'
  )
    .then(
      (mod) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        mod.isPlainObject
    )
    .catch((_e) => {
      throw new Error(
        'Comparative benchmarks requires httpx/assert to be built (yarn build)'
      );
    });
  const is = await import('@sindresorhus/is').then((mod) => mod.default);
  const isPlainObj = await import('is-plain-obj').then((mod) => mod.default);
  const lodash = await import('lodash-es').then((mod) => mod.default);

  // @ts-expect-error packaging of this lib is not compatible with latest ts / module
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jonschlinkertIsPlainObject = await import('is-plain-object').then(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    (mod) => mod.isPlainObject
  );

  bench('@httpx/plain-object: `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      httpxIsPlainObject(value);
    }
  });

  bench('(sindresorhus/)is-plain-obj: `isPlainObj(v)`', () => {
    for (const value of realLifeScenarios) {
      isPlainObj(value);
    }
  });

  bench('@sindresorhus/is: `is.plainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      is.plainObject(value);
    }
  });

  bench('(jonschlinkert/)is-plain-object: `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      jonschlinkertIsPlainObject(value);
    }
  });

  bench('lodash-es: `_.isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      lodash.isPlainObject(value);
    }
  });
});
