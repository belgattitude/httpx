type FetcherRelatedHttpMethod = 'get' | 'head' | 'options' | 'trace';

export type FetchOptions = {
  /**
   * Timeout in seconds for each request.
   * @default 30_000 (30 seconds)
   */
  timeoutMs: number | false;

  retry: {
    /**
     * The number of times to retry failed requests.
     * @default 3
     */
    limit?: number;
    /**
     * The HTTP methods allowed to retry.
     * @default ['get', 'head', 'options', 'trace']
     */
    methods?: FetcherRelatedHttpMethod[];
    /**
     *The HTTP status codes allowed to retry.
     *
     * @default [408, 413, 429, 500, 502, 503, 504]
     */
    statusCodes?: number[];
    /**
     * The HTTP status codes allowed to retry with a `Retry-After` header.
     *
     * @default [413, 429, 503]
     */
    afterStatusCodes?: number[];
    /**
     * If the `Retry-After` header is greater than `maxRetryAfter`, the request will be canceled.
     *
     * @default Number.POSITIVE_INFINITY
     */
    maxRetryAfter?: number;

    /**
     * The upper limit of the delay per retry in milliseconds.
     * To clamp the delay, set `backoffLimit` to 1000, for example.
     *
     * @default undefined
     */
    backoffLimit?: number;

    /**
     * A function to calculate the delay between retries given `attemptCount` (starts from 1).
     *
     * @default attemptCount => 0.3 * (2 ** (attemptCount - 1)) * 1000
     */
    delay?: (attemptCount: number) => number;

    /**
     * Whether to retry when the request times out.
     *
     * @default true
     */
    retryOnTimeout?: boolean;
  };
};

export const defaultFetchOptions = {
  timeoutMs: 30_000,
  retry: {
    limit: 3,
    methods: ['get', 'head', 'options', 'trace'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
    afterStatusCodes: [413, 429, 503],
    maxRetryAfter: Number.POSITIVE_INFINITY,
    retryOnTimeout: true,
    delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000,
  },
} as const satisfies FetchOptions;
