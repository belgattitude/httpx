import ky, { HTTPError, type KyResponse } from 'ky';

import { fail, type Result, success } from './base/result';
import { InvalidOidcConfigError } from './error';
import { FetchError } from './error/fetch-error';
import { defaultFetchOptions, type FetchOptions } from './fetch-options';
import {
  type DiscoveryPayload,
  isDiscoveryPayload,
} from './utils/discovery-payload';

export type OidcDiscoveryOptions = FetchOptions;

export class OidcDiscoveryFetcher {
  #options: NonNullable<OidcDiscoveryOptions>;
  constructor(options?: OidcDiscoveryOptions) {
    this.#options = {
      timeoutMs: options?.timeoutMs ?? defaultFetchOptions.timeoutMs,
      retry: {
        ...defaultFetchOptions.retry,
        ...options?.retry,
      },
    };
  }

  /**
   * Fetches and validates the OIDC Discovery Payload from the given URL.
   *
   * @example
   * ```typescript
   * import { OidcDiscoveryFetcher } from '@flowblade/jwt-verify';
   *
   * const fetchOptions = {
   *   // These are the default options, you can customize them as needed
   *   // in the constructor or in safeFetch
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
   * }
   *
   * const fetcher = new OidcDiscoveryFetcher(fetchOptions);
   *
   * // Any oidc discovery url
   * const oidcDiscoveryUrl = 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration';
   *
   * const { data, error } = await fetcher.safeFetch(oidcDiscoveryUrl,
   *   // optional
   *   fetchOptions
   * );
   *
   * if (data) {
   *   console.log('Discovery Payload:', data);
   * }
   *
   * if (error) {
   *  // FetchError | InvalidOidcConfigError
   *  console.error('Error fetching OIDC configuration:', error);
   * }
   * ```
   */
  safeFetch = async (
    wellKnownUrl: string,
    options?: OidcDiscoveryOptions
  ): Promise<Result<DiscoveryPayload, FetchError | InvalidOidcConfigError>> => {
    let response: KyResponse;
    try {
      response = await ky.get(wellKnownUrl, {
        cache: 'no-store',
        timeout: options?.timeoutMs ?? this.#options.timeoutMs,
        headers: {
          accept: 'application/json',
        },
        throwHttpErrors: true,
        retry: {
          ...this.#options.retry,
          ...options?.retry,
        },
      });
    } catch (e) {
      const { status, statusText } = e instanceof HTTPError ? e.response : {};
      return fail(
        new FetchError(
          {
            message: `Failed to fetch OIDC configuration at ${wellKnownUrl}`,
            url: wellKnownUrl,
            statusText: statusText,
            statusCode: status,
          },
          {
            cause: e as Error | HTTPError,
          }
        )
      );
    }

    let discoveryPayload: DiscoveryPayload;
    try {
      discoveryPayload = await response.json<DiscoveryPayload>();
    } catch (e) {
      return fail(
        new InvalidOidcConfigError('Json parsing error', {
          cause: e as Error,
        })
      );
    }
    if (!isDiscoveryPayload(discoveryPayload)) {
      return fail(
        new InvalidOidcConfigError(
          'Fetched discovery payload is not a valid OIDC Discovery Payload'
        )
      );
    }
    return success(discoveryPayload);
  };
}
