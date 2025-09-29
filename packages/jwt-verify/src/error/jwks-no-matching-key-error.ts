import { createHasInstance, type TypedError } from '../base/typed-error';

export class JwksNoMatchingKeyError extends Error implements TypedError {
  readonly type = 'jwks-no-matching-key';
  static override [Symbol.hasInstance] = createHasInstance(
    'jwks-no-matching-key',
    Error
  );
}
