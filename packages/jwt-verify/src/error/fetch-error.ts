import type { HTTPError } from 'ky';

import { createHasInstance, type TypedError } from '../base/typed-error';

export class FetchError extends TypeError implements TypedError {
  readonly type = 'fetch-error';
  /**
   * Http status code that is related to the FetchError if available
   */
  readonly statusCode: number | undefined;
  /**
   * Http statusText that is related to the FetchError if available
   */
  readonly statusText: string | undefined;

  /**
   * Url that was being fetched when the error occurred
   */
  readonly url: string | undefined;

  constructor(
    params: {
      message: string;
      /**
       * Url that was being fetched when the error occurred
       */
      url: string;
      /**
       * Http status code that is related to the FetchError if available
       */
      statusCode?: number | undefined;
      /**
       * Http status code that is related to the FetchError if available
       */
      statusText?: string | undefined;
    },
    options: {
      cause?: Error | HTTPError;
    }
  ) {
    super(params.message, options);
    Object.setPrototypeOf(this, FetchError.prototype);
    this.name = `FetchError`;
    this.statusCode = params.statusCode;
    this.statusText = params.statusText;
    this.url = params.url;
  }
  static override [Symbol.hasInstance] = createHasInstance(
    'fetch-error',
    TypeError
  );
}
