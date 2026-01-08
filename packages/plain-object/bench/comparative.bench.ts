import { bench, describe } from 'vitest';

import { devDependencies } from '../package.json' with { type: 'json' };
import { immerIsPlainObject } from '../src/__tests__/comparison/immer-is-plain-object';

const versions = devDependencies;

/**
 * Based on a hypothesis:
 */
const realLifeScenarios = [
  ...Array.from({ length: 10 }).map((_) => ({})),
  ...Array.from({ length: 10 }).map((_) => ({
    key1: {
      subkey: [],
    },
  })),
  // Others: not plain objects
  ...Array.from({ length: 10 }).fill(new Map([['key', 10]])),
  ...Array.from({ length: 10 }).fill(new Date()),
  ...Array.from({ length: 10 }).fill(null),
  // eslint-disable-next-line unicorn/no-useless-undefined
  ...Array.from({ length: 10 }).fill(undefined),
  ...Array.from({ length: 10 }).fill(1),
  ...Array.from({ length: 10 }).fill(0),
  ...Array.from({ length: 10 }).fill('str'),
  ...Array.from({ length: 10 }).fill(''),
  ...Array.from({ length: 10 }).fill(Number.NaN),
] as const;

describe(`Compare calling isPlainObject with ${realLifeScenarios.length}x mixed types values`, async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const httpxIsPlainObject: (_v: unknown) => boolean = await import(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to apply benchmarks assert must be built
    // eslint-disable-next-line import-x/no-unresolved
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
  const sindreIsIsPlainObject = is.plainObject;
  const isPlainObj = await import('is-plain-obj').then((mod) => mod.default);
  const lodash = await import('lodash-es').then((mod) => mod);
  const lodashIsPlainObject = lodash.isPlainObject;
  const esToolkitIsPlainObject = await import('es-toolkit').then(
    (mod) => mod.isPlainObject
  );

  const redux = await import('redux').then((mod) => mod);
  const reduxIsPlainObject = redux.isPlainObject;

  // @ts-expect-error packaging of this lib is not compatible with latest ts / module
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jonschlinkertIsPlainObject = await import('is-plain-object').then(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    (mod) => mod.isPlainObject
  );

  bench('"@httpx/plain-object": `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      httpxIsPlainObject(value);
    }
  });

  bench(`"is-plain-obj":"${versions['is-plain-obj']}": 'isPlainObj(v)'`, () => {
    for (const value of realLifeScenarios) {
      isPlainObj(value);
    }
  });

  bench(
    `"@sindresorhus/is":"${versions['@sindresorhus/is']}": 'is.plainObject(v)'`,
    () => {
      for (const value of realLifeScenarios) {
        sindreIsIsPlainObject(value);
      }
    }
  );

  bench(`"es-toolkit":"${versions['es-toolkit']}": 'isPlainObject(v)'`, () => {
    for (const value of realLifeScenarios) {
      esToolkitIsPlainObject(value);
    }
  });

  bench(`"redux":"${versions.redux}": 'isPlainObject(v)'`, () => {
    for (const value of realLifeScenarios) {
      reduxIsPlainObject(value);
    }
  });

  bench(
    `"is-plain-object":"${versions['is-plain-object']}": 'isPlainObject(v)'`,
    () => {
      for (const value of realLifeScenarios) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        jonschlinkertIsPlainObject(value);
      }
    }
  );

  bench(`"immer/is-plain-object":"4.2.0": 'isPlainObject(v)'`, () => {
    for (const value of realLifeScenarios) {
      immerIsPlainObject(value);
    }
  });

  bench(`lodash-es:"${versions['lodash-es']}": '_.isPlainObject(v)'`, () => {
    for (const value of realLifeScenarios) {
      lodashIsPlainObject(value);
    }
  });
});
