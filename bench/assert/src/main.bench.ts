// import { isPlainObject } from '@httpx/assert';
import { isPlainObject } from '@httpx/assert';
import is from '@sindresorhus/is';
import { isPlainObject as lodashIsPlainObject } from 'lodash-es';
import { bench, describe } from 'vitest';

const { plainObject } = is;

describe('isPlainObject', () => {
  const realLifeScenarios = [
    ...Array.from({ length: 80 }).fill({}),
    ...Array.from({ length: 5 }).fill(null),
    // eslint-disable-next-line unicorn/no-useless-undefined
    ...Array.from({ length: 5 }).fill(undefined),
    ...Array.from({ length: 5 }).fill('str'),
    ...Array.from({ length: 5 }).fill(new Map()),
  ];
  bench('@httpx/assert:    `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = isPlainObject(value);
    }
  });

  bench('@sindresorhus/is: `is.plainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = is.plainObject(value);
    }
  });

  bench('@sindresorhus/is: `const { is } = is; plainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = plainObject(value);
    }
  });

  bench('lodash-es: `isPlainObject(v)`', () => {
    for (const value of realLifeScenarios) {
      const _v8 = lodashIsPlainObject(value);
    }
  });
});
