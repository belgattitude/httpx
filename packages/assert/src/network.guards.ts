import type { NetworkPort } from './network.types';

export const isNetworkPort = (v: unknown): v is NetworkPort => {
  return typeof v === 'number' && v >= 0 && v <= 65_535;
};
