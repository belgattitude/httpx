import type { JOSEError } from 'jose/errors';

import { createHasInstance, type TypedError } from '../base/typed-error';

export class JwtVerifyError extends Error implements TypedError {
  readonly type = 'jwt-verify';
  readonly code: string;
  constructor(msg: string, options: { cause: Error | JOSEError }) {
    super(msg, { cause: options.cause });
    Object.setPrototypeOf(this, JwtVerifyError.prototype);
    this.code = (options.cause as JOSEError)?.code || 'JwtVerifyError';
  }
  static override [Symbol.hasInstance] = createHasInstance('jwt-verify', Error);
}
