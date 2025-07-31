import { vitestBenchOptionsConfig } from '@httpx/devtools-vitest';
import type { bench } from 'vitest';

const isCiOrCodSpeed =
  vitestBenchOptionsConfig.isCiOrCodSpeed ||
  ['true', '1'].includes(process.env?.CI ?? 'false');

export const benchConfig = {
  isCiOrCodSpeed,
  benchOptions: {
    iterations: isCiOrCodSpeed ? 2 : 10,
    time: isCiOrCodSpeed ? 300 : 800, // 300ms in CI or CodeSpeed, 800ms in local
    warmupIterations: 1,
  } as const satisfies Parameters<typeof bench>[2],
} as const;
