import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

const isCiOrCodSpeed = vitestBenchOptionsConfig.isCiOrCodSpeed;

export const benchConfig = {
  samples: isCiOrCodSpeed ? 1 : 1000,
  benchOptions: {
    iterations: isCiOrCodSpeed ? 1 : 4,
  },
} as const;
