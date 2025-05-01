import isCi from 'is-ci';

const isCodSpeedEnabled = process.env?.CODSPEED === '1';
const isCiOrCodSpeedEnabled = isCi || isCodSpeedEnabled;

export const vitestBenchOptionsConfig = {
  isCi: isCi,
  isCiOrCodSpeed: isCiOrCodSpeedEnabled,
  createBenchOptions: (options: {
    iterations: {
      ciOrCodSpeed: number;
      local: number;
    };
  }) => {
    const { iterations } = options;
    return {
      iterations: isCiOrCodSpeedEnabled
        ? iterations.ciOrCodSpeed
        : iterations.local,
    };
  },
} as const;
