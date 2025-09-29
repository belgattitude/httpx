import { createHasInstance, type TypedError } from '../base/typed-error';

export class ExpiredTokenError extends Error implements TypedError {
  readonly type = 'expired-token';
  static override [Symbol.hasInstance] = createHasInstance(
    'expired-token',
    Error
  );
}
