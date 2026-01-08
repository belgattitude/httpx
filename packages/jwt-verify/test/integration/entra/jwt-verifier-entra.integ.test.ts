import * as v from 'valibot';

import { JwtVerifier } from '../../../src/jwt-verifier';

const isBrowser = typeof window !== 'undefined';

/**
 * To run this test, you need to provide a valid token in the env var
 * TEST_INTEG_ENTRA_VALID_TOKEN, either in the CI or in your local env.
 */
const entraJwtToken = isBrowser
  ? undefined
  : process.env.TEST_INTEG_ENTRA_VALID_TOKEN!;

const entraTenantId = isBrowser
  ? undefined
  : process.env.TEST_INTEG_ENTRA_TENANT_ID!;

describe.skipIf(entraJwtToken === undefined)(
  'Microsoft entra integration test',
  () => {
    it('should parse', async () => {
      const entraSchema = v.object({
        aio: v.string(), // "ASQA2/8ZAAAAsHFQOHLRysRcnpHLKr/dscVPztjPPAurvLaxtpEQvJM=",
        azp: v.string(), // "f273d9c0-e362-4062-a493-05a080884239",
        azpacr: v.string(),
        oid: v.string(),
        rh: v.string(), // "1.AYIASbiljOFTz0iJ-wEDiGryABQr46e4GqxOmemHshMY9q6CAACCAA.",
        sub: v.string(), // "78e95575-4752-4134-8378-b5fb0040dc65",
        tid: v.string(), // "8ca5b849-53e1-48cf-89fb-0103886af200",
        uti: v.string(), // "mAu3lSbGrkOo_frI0DYsAA",
        ver: v.string(), // "2.0",
        xms_ftd: v.string(), // "vsBFeH3GcQuKsYqrjhfBdQ3V8GUJgH-A-81Xn2bdz_EBZXVyb3Bld2VzdC1kc21z"
      });

      const entraJwtVerifier = new JwtVerifier({
        authorityHost: 'https://login.microsoftonline.com',
        tenantId: `${entraTenantId}`,
        clockToleranceSec: 10_000_000, // allow to have a big clock tolerance for tests
      });

      const { data, error } = await entraJwtVerifier.safeParse(entraJwtToken!, {
        schema: entraSchema,
      });
      expect(error).toBeUndefined();
      expect(data).toBeDefined();

      expect(data).toMatchObject({
        expiresAt: expect.any(Date),
        issuer: expect.stringContaining(entraTenantId!),
        jwksUri: expect.stringContaining(entraTenantId!),
        notBefore: expect.any(Date),
        payload: {
          oid: expect.stringMatching(/^([0-9a-z-]){1,40}$/),
        },
      });
    });
  }
);
