import * as v from 'valibot';
import { describe } from 'vitest';

import { NotATokenError } from './error/not-a-token-error';
import { JwtVerifier } from './jwt-verifier';

describe('JWTVerifier', () => {
  describe('safeParse', () => {
    const verifier = new JwtVerifier({
      authorityHost: 'https://login.microsoftonline.com',
      tenantId: 'common',
    });
    it('should return NotATokenError if token is empty', async () => {
      const { data, error } = await verifier.safeParse('');
      expect(data).toBeUndefined();
      expect(error).toBeInstanceOf(TypeError);
      expect(error).toBeInstanceOf(NotATokenError);
      expect(error?.type).toBe('not-a-token');
      if (error) {
        expectTypeOf(data).toBeUndefined();
      }
      if (data) {
        expectTypeOf(error).toBeUndefined();
      }
    });
  });

  describe('type tests', () => {
    const verifier = new JwtVerifier({
      authorityHost: 'https://login.microsoftonline.com',
      tenantId: 'common',
    });
    it('should correctly infer return types based on provided schema', async () => {
      const { data, error } = await verifier.safeParse('some-token', {
        schema: v.object({
          oid: v.string(),
        }),
      });
      const { payload } = data!;
      expectTypeOf(payload).toEqualTypeOf<{ oid: string }>();
    });
  });
});
