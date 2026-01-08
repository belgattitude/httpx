import { isPlainObject } from '@httpx/plain-object';

export type DiscoveryPayload = {
  issuer: string;
  jwks_uri: string;
};

export const isDiscoveryPayload = (v: unknown): v is DiscoveryPayload => {
  return (
    isPlainObject<{ issuer: string; jwks_uri: string }>(v) &&
    typeof v.issuer === 'string' &&
    v.issuer.trim()?.length > 0 &&
    typeof v.jwks_uri === 'string' &&
    v.jwks_uri.trim()?.length > 0
  );
};
