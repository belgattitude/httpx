import { OidcDiscoveryFetcher } from '../../../src';

describe('oidc-discovery-entra', () => {
  describe('safeFetch', async () => {
    it('should return a payload containing expected issuer and jwks_uri for Entra', async () => {
      const oidcDiscovery = new OidcDiscoveryFetcher();
      const { error, data: oidcPayload } = await oidcDiscovery.safeFetch(
        'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
      );
      expect(error).toBeUndefined();
      const { issuer, jwks_uri } = oidcPayload ?? {};
      expect(issuer).toBe('https://login.microsoftonline.com/{tenantid}/v2.0');
      expect(jwks_uri).toBe(
        'https://login.microsoftonline.com/common/discovery/v2.0/keys'
      );
    });
  });
});
