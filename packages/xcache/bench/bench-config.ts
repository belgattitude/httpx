import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

const isCiOrCodSpeed = vitestBenchOptionsConfig.isCiOrCodSpeed;

export const benchConfig = {
  benchOptions: {
    iterations: isCiOrCodSpeed ? 3 : 100,
  },
} as const;
