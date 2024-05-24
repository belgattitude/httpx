import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import * as v from 'valibot';
import { bench, describe } from 'vitest';
import { z } from 'zod';

const realLifeScenarios = [
  ...Array.from({ length: 70 }).map((_) => ({ a: Math.random() })),
  ...Array.from({ length: 10 }).fill(new Map()),
  ...Array.from({ length: 5 }).fill(null),
  // eslint-disable-next-line unicorn/no-useless-undefined
  ...Array.from({ length: 5 }).fill(undefined),
  ...Array.from({ length: 10 }).fill('str'),
];

const zodSchema = z.record(z.string(), z.unknown());
const valibotSchema = v.record(v.string(), v.unknown());
const typeboxSchema = Type.Record(Type.String(), Type.Unknown());

describe(`Compare calling ${realLifeScenarios.length}x isPlainObject with mixed types values`, async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore to apply benchmarks assert must be built
  const httpxIsPlainObject: (_v) => boolean = await import('@httpx/assert')
    .then((mod) => mod.isPlainObject)
    .catch((_e) => {
      throw new Error(
        'Comparative benchmarks requires httpx/assert to be built (yarn build)'
      );
    });
  const is = await import('@sindresorhus/is').then((mod) => mod.default);
  const isPlainObj = await import('is-plain-obj').then((mod) => mod.default);
  const lodash = await import('lodash-es').then((mod) => mod.default);

  bench('@httpx/assert: `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      httpxIsPlainObject(value);
    }
  });

  bench('is-plain-obj: `isPlainObj(v)`', () => {
    for (const value of realLifeScenarios) {
      isPlainObj(value);
    }
  });

  bench('@sindresorhus/is: `is.plainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      is.plainObject(value);
    }
  });

  bench('lodash-es: `_.isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      lodash.isPlainObject(value);
    }
  });

  bench('zod: `z.record(z.string(), z.unknown())`', () => {
    for (const value of realLifeScenarios) {
      zodSchema.safeParse(value);
    }
  });

  bench('valibot: `z.record(z.string(), z.unknown())`', () => {
    for (const value of realLifeScenarios) {
      v.safeParse(valibotSchema, v);
    }
  });

  bench('typebox: `Type.Record(Type.String(), Type.Unknown()) (check)`', () => {
    for (const value of realLifeScenarios) {
      Value.Check(typeboxSchema, v);
    }
  });
});
