import { createHasInstance, type TypedError } from '../base/typed-error';

export class NotATokenError extends TypeError implements TypedError {
  readonly type = 'not-a-token';
  static override [Symbol.hasInstance] = createHasInstance(
    'not-a-token',
    TypeError
  );
}
