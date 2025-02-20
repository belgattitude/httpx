import { bench } from 'vitest';

const options: Parameters<typeof bench>[2] = {
  time: 1,
};

describe('MCache benches', () => {
  bench(
    'should be fast',
    () => {
      const a = 1;
    },
    options
  );
});
