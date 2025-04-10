import isCi from 'is-ci';

export const benchConfig = {
  samples: isCi ? 100 : 1000,
  iterations: 1,
} as const;
