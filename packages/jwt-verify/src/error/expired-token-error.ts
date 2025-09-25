import { createHasInstance, type TypedError } from '../base/typed-error';

export class ExpiredTokenError extends Error implements TypedError {
  readonly type = 'expired-error';
  static override [Symbol.hasInstance] = createHasInstance(
    'expired-error',
    Error
  );
}
