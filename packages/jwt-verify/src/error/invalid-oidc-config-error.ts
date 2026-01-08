import { createHasInstance, type TypedError } from '../base/typed-error';

export class InvalidOidcConfigError extends TypeError implements TypedError {
  readonly type = 'invalid-oidc-config-error';
  static override [Symbol.hasInstance] = createHasInstance(
    'invalid-oidc-config-error',
    TypeError
  );
}
