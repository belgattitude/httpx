// import { isPlainObject } from '../dist/index.mjs';
import { isPlainObject } from '@httpx/assert';
import is from '@sindresorhus/is';
import { Bench } from 'tinybench';

const bench = new Bench({ time: 1000 });

const realLifeScenarios = [
  ...Array.from({ length: 70 }).map((_) => ({ a: Math.random() })),
  ...Array.from({ length: 10 }).fill(new Map()),
  ...Array.from({ length: 5 }).fill(null),
  // eslint-disable-next-line unicorn/no-useless-undefined
  ...Array.from({ length: 5 }).fill(undefined),
  ...Array.from({ length: 10 }).fill('str'),
];
const { plainObject } = is;
bench
  .add('@httpx/assert (isPlainObject)', () => {
    realLifeScenarios.forEach((value) => isPlainObject(value));
  })
  .add('@sindresorhus/is (is.plainObject(v))', async () => {
    realLifeScenarios.forEach((value) => is.plainObject(value));
  })
  .add(
    '@sindresorhus/is (const { plainObject } = is; plainObject(v))',
    async () => {
      realLifeScenarios.forEach((value) => plainObject(value));
    }
  )
  .todo('unimplemented bench');

await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.run();

console.table(bench.table());
