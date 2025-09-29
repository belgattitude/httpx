import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
  createRemoteJWKSet,
  type JWSHeaderParameters,
  type JWTPayload,
  jwtVerify,
  type JWTVerifyResult,
} from 'jose';
import type { JOSEError } from 'jose/errors';

import { fail, type Result, success } from './base/result';
import {
  type ExpiredTokenError,
  FetchError,
  JwtVerifyError,
  NotATokenError,
  SchemaValidationError,
} from './error';

export type JwtVerifierOptions = {
  /**
   * The tenant ID to use in the authority URL, e.g. 'common', 'shared' or a specific tenant ID
   */
  tenantId: string;

  audience?: string | string[];
  /**
   * The authority host URL, e.g. https://login.microsoftonline.com for azure
   */
  authorityHost: string;
  expectedIssuer?: string; // override issuer from discovery if needed
  clockToleranceSec?: number; // default 60s
  schema?: StandardSchemaV1<unknown>; // optional schema to validate payload
};

const defaultVerifierOptions = {
  clockToleranceSec: 60,
} as const satisfies Omit<JwtVerifierOptions, 'authorityHost' | 'tenantId'>;

type ParseErrors =
  | NotATokenError
  | ExpiredTokenError
  | FetchError
  | SchemaValidationError;

export type ParsedJwtSuccess<TPayload extends JWTPayload = JWTPayload> = {
  payload: TPayload;
  rawPayload: JWTPayload;
  protectedHeader: JWSHeaderParameters;
  issuer: string;
  jwksUri: string;
  expiresAt?: Date | undefined;
  notBefore?: Date | undefined;
};

export class JwtVerifier {
  #options: JwtVerifierOptions;

  constructor(options: JwtVerifierOptions) {
    this.#options = options;
  }

  /**
   * Safely parse and verify a JWT token
   *
   * @example
   * ```typescript
   * import { JWTVerifier } from 'jose';
   * import * as v from 'valibot'; // or any standard-schema compatible schema library
   *
   * const entraVerifier = new JwtVerifier({
   *   authorityHost: 'https://login.microsoftonline.com',
   *   tenantId: '8ca5b849-53e1-48cf-89fb-0103886af200',
   *   clockToleranceSec: 60, // optional
   * });
   *
   * const token = '...';
   *
   * const { error, value } = await entraVerifier.safeParse(token, {
   *    schema: v.object({
   *      oid: v.string(),
   *    })
   * });
   *
   * if (error) {
   *   // handle error amongst
   *   // - NotATokenError
   *   // - ExpiredTokenError
   *   // - FetchError
   *   // - SchemaValidationError
   *   // - JwtVerifyError
   * }
   * ```
   */
  safeParse = async <TSchema extends StandardSchemaV1>(
    token: string,
    options?: {
      schema?: TSchema;
    }
  ): Promise<
    Result<
      ParsedJwtSuccess<
        TSchema extends undefined
          ? StandardSchemaV1.InferOutput<TSchema> & JWTPayload
          : JWTPayload
      >,
      ParseErrors
    >
  > => {
    if (typeof token !== 'string' || token.trim().length === 0) {
      return fail(new NotATokenError('JWT token must be a non-empty string'));
    }

    let discovery: { issuer: string; jwks_uri: string };
    try {
      discovery = await this.fetchOidcConfig();
    } catch (e) {
      return fail(new FetchError((e as Error)?.message, { cause: e as Error }));
    }

    const jwks = createRemoteJWKSet(new URL(discovery.jwks_uri), {});

    const {
      expectedIssuer,
      audience,
      clockToleranceSec = defaultVerifierOptions.clockToleranceSec,
    } = this.#options;

    const issuer = expectedIssuer ?? discovery.issuer;

    const acceptedAlgos = ['RS256'];

    let verifyResult: JWTVerifyResult;

    try {
      verifyResult = await jwtVerify(token, jwks, {
        issuer,
        ...(audience === undefined ? {} : { audience }),
        algorithms: acceptedAlgos,
        clockTolerance: clockToleranceSec,
      });
    } catch (e) {
      throw new JwtVerifyError(`Failed to verify JWT ${(e as Error).message}`, {
        cause: e as Error | JOSEError,
      });
    }

    const { payload, protectedHeader } = verifyResult;

    type TValidatedPayload = TSchema extends undefined
      ? StandardSchemaV1.InferOutput<TSchema> & JWTPayload
      : JWTPayload;
    let validatedPayload: TValidatedPayload;

    const { schema } = options ?? {};

    if (schema) {
      let result = schema['~standard'].validate(payload);
      if (result instanceof Promise) result = await result;

      if (result.issues) {
        return fail(new SchemaValidationError());
      }
      validatedPayload = (result.value ?? payload) as TValidatedPayload;
    } else {
      validatedPayload = payload as TValidatedPayload;
    }

    const result: ParsedJwtSuccess<TValidatedPayload> = {
      payload: validatedPayload,
      rawPayload: payload,
      protectedHeader,
      issuer,
      jwksUri: discovery.jwks_uri,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      notBefore: payload.nbf ? new Date(payload.nbf * 1000) : undefined,
    };

    return success(result);
  };

  fetchOidcConfig = async () => {
    const { authorityHost, tenantId } = this.#options;
    const wellKnownUrl = `${authorityHost}/${tenantId}/v2.0/.well-known/openid-configuration`;
    const res = await fetch(wellKnownUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new FetchError(
        `Failed to fetch OIDC configuration at ${wellKnownUrl}`,
        {
          cause: { status: res.status, statusText: res.statusText },
        }
      );
    }
    const discovery = (await res.json()) as {
      issuer: string;
      jwks_uri: string;
    };
    return discovery;
  };
}
