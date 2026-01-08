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
  type FetchError,
  type InvalidOidcConfigError,
  JwtVerifyError,
  NotATokenError,
  SchemaValidationError,
} from './error';
import {
  OidcDiscoveryFetcher,
  type OidcDiscoveryOptions,
} from './oidc-discovery-fetcher';

export type JwtVerifierOptions = {
  /**
   * The tenant identifier used to build the OIDC authority URL.
   *
   * Accepts a GUID tenant id (for a single-tenant app) or one of the Azure shortcuts:
   * `common`, `organizations`, or `consumers`.
   *
   * This value is appended to `authorityHost` as the path segment used to locate
   * the OpenID Connect discovery document (for example:
   * `{authorityHost}/{tenantId}/v2.0/.well-known/openid-configuration`).
   * Do not include leading or trailing slashes.
   *
   * @example
   * // single-tenant (GUID)
   * tenantId = '8ca5b849-53e1-48cf-89fb-0103886af200';
   *
   * @example
   * // multi-tenant or common endpoints
   * tenantId = 'common';
   */
  tenantId: string;

  /**
   * The expected audience(s) to validate against the token's `aud` claim.
   *
   * Accepts either a single string (for example a client\_id, scope or resource URI)
   * or an array of strings when the token may be valid for multiple audiences.
   * When provided, the verifier requires the token's `aud` claim to match at least
   * one of these values. If omitted, audience validation is not performed.
   *
   * @example
   * // single audience
   * audience = 'api://1234';
   *
   * @example
   * // multiple audiences
   * audience = ['api://1234', 'https://api.example.com'];
   *
   * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3
   */
  audience?: string | string[];

  /**
   * The base authority host URL used to locate the OIDC discovery document and for issuer resolution.
   *
   * Must be an absolute URL including the scheme (for example `https://login.microsoftonline.com`).
   * Do not include a trailing slash or additional path segments — the verifier appends the
   * `tenantId` and discovery path (for example:
   * `{authorityHost}/{tenantId}/v2.0/.well-known/openid-configuration`).
   *
   * Use a secure `https` endpoint in production. Can point to a custom identity provider or a
   * local endpoint for testing; when using non‑standard ports include them in the URL.
   *
   * @example
   * // Azure public cloud
   * authorityHost = 'https://login.microsoftonline.com';
   *
   * @example
   * // custom identity provider
   * authorityHost = 'https://auth.example.com';
   *
   * @example
   * // local testing (include scheme and port)
   * authorityHost = 'http://localhost:8080';
   *
   * @see https://openid.net/specs/openid-connect-discovery-1_0.html
   */
  authorityHost: string;

  /**
   * Override issuer used to validate the token's `iss` claim.
   *
   * When provided, this value is used instead of the issuer obtained from the OIDC
   * discovery document. Use this to validate tokens when the discovery issuer does
   * not match the token's `iss` claim (for example in testing, proxies, or custom
   * deployments). Must be the full issuer URL expected in the token's `iss` claim
   * (including scheme and host). Avoid trailing slashes.
   *
   * @example
   * // Azure single-tenant issuer
   * expectedIssuer = 'https://login.microsoftonline.com/8ca5b849-53e1-48cf-89fb-0103886af200/v2.0';
   *
   * @example
   * // Custom identity provider
   * expectedIssuer = 'https://auth.example.com';
   *
   * @see https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1
   */
  expectedIssuer?: string;

  /**
   * Allowed clock skew in seconds when validating time-based claims (`exp`, `nbf`, `iat`).
   *
   * This value is forwarded to the underlying JWT verifier as `clockTolerance`.
   * Use a small positive number to tolerate minor clock differences between the
   * token issuer and verifier. Value is in seconds. Increasing this value relaxes
   * expiry/nbf checks — avoid large values in security-sensitive contexts.
   *
   * @example
   * // default one minute tolerance
   * clockToleranceSec = 60;
   *
   * @example
   * // allow five seconds of skew
   * clockToleranceSec = 5;
   *
   * @default 60
   */
  clockToleranceSec?: number;

  /**
   * Optional standard-schema compatible vaildation schema used to validate
   * the decoded JWT payload. Most li
   *
   * When provided on the verifier instance it acts as the default for all `safeParse` calls.
   * Each `safeParse` call may also pass a `schema` to override the verifier default.
   *
   * @see https://standardschema.dev/schema#what-schema-libraries-implement-the-spec
   */
  schema?: StandardSchemaV1<unknown>; // optional schema to validate payload

  /**
   * Optionally pass options to configure the OIDC configuration fetcher.
   *
   * By default the fetcher uses a 30 seconds timeout and retries up to 3 times
   *
   * ```typescript
   * const defaultFetchOptions = {
   *   timeoutMs: 30_000,
   *   retry: {
   *     limit: 3,
   *     methods: ['get', 'head', 'options', 'trace'],
   *     statusCodes: [408, 413, 429, 500, 502, 503, 504],
   *     afterStatusCodes: [413, 429, 503],
   *     maxRetryAfter: Number.POSITIVE_INFINITY,
   *     retryOnTimeout: true,
   *     delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000,
   *   },
   * } as const satisfies OidcConfigFetchOptions;
   * ```
   */
  oidcConfigFetchOptions?: OidcDiscoveryOptions;
};

const defaultVerifierOptions = {
  clockToleranceSec: 60,
} as const satisfies Omit<JwtVerifierOptions, 'authorityHost' | 'tenantId'>;

type JwtVerifyErrors =
  | NotATokenError
  | ExpiredTokenError
  | FetchError
  | SchemaValidationError
  | JwtVerifyError
  | InvalidOidcConfigError;

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
  #oidcFetcher: OidcDiscoveryFetcher;

  constructor(options: JwtVerifierOptions) {
    this.#options = options;
    this.#oidcFetcher = new OidcDiscoveryFetcher(
      options?.oidcConfigFetchOptions
    );
  }

  /**
   * Safely parse and verify a JWT token
   *
   * @example
   * ```typescript
   * import { JWTVerifier } from '@httpx/jwt-verify';
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
   * const { data, error } = await entraVerifier.safeParse(token, {
   *    schema: v.object({
   *      oid: v.string(),
   *    })
   * });
   *
   * // If something failed the error will be !== undefined
   * if (error) {
   *   // `error` is an instance Error with a brand of TypedError
   *   // Currently supported are: NotATokenError, ExpiredTokenError
   *   // SchemaValidationError, JwtVerifyError, FetchError
   * }
   *
   * // If everything went fine, data will be defined
   * console.log('Token payload:', data.payload);
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
          ? JWTPayload
          : // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
            StandardSchemaV1.InferOutput<TSchema> & JWTPayload
      >,
      JwtVerifyErrors
    >
  > => {
    if (typeof token !== 'string' || token.trim().length === 0) {
      return fail(new NotATokenError('JWT token must be a non-empty string'));
    }

    const { authorityHost, tenantId } = this.#options;
    const wellKnownUrl = `${authorityHost}/${tenantId}/v2.0/.well-known/openid-configuration`;

    const { error: discoveryError, data: discovery } =
      await this.#oidcFetcher.safeFetch(
        wellKnownUrl,
        this.#options.oidcConfigFetchOptions
      );

    if (discoveryError) {
      return fail(discoveryError);
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
      return fail(
        new JwtVerifyError(`Failed to verify JWT ${(e as Error).message}`, {
          cause: e as Error | JOSEError,
        })
      );
    }

    const { payload, protectedHeader } = verifyResult;

    type TValidatedPayload = TSchema extends undefined
      ? JWTPayload
      : // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        StandardSchemaV1.InferOutput<TSchema> & JWTPayload;

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
}
