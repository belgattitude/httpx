import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

const defaultOptions = vitestBenchOptionsConfig.createBenchOptions({
  iterations: {
    ciOrCodSpeed: 1,
    local: 1,
  },
});

const { isCiOrCodSpeed } = vitestBenchOptionsConfig;

export const benchOptions = {
  iterations: defaultOptions.iterations,
  time: isCiOrCodSpeed ? 100 : 500,
};

const SEEDS_COUNT = isCiOrCodSpeed ? 10 : 1000;

export const benchSeeds = {
  lruMaxSize: SEEDS_COUNT,
  lruMaxSizeHalf: Math.floor(SEEDS_COUNT / 2),
  getSeeds: () => {
    return Array.from({ length: SEEDS_COUNT }).map((_, i) => ({
      key: `key-${i}`,
      value: `value-${i}`,
    }));
  },
};
