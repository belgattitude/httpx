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
