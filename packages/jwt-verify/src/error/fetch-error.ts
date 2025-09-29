import { createHasInstance, type TypedError } from '../base/typed-error';

export class FetchError extends TypeError implements TypedError {
  readonly type = 'fetch-error';
  static override [Symbol.hasInstance] = createHasInstance(
    'fetch-error',
    TypeError
  );
}
