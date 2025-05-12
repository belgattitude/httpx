import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';

const isCiOrCodSpeed = vitestBenchOptionsConfig.isCiOrCodSpeed;

export const benchConfig = {
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
  },
} as const;
