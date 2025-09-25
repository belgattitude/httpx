import { createHasInstance, type TypedError } from '../base/typed-error';

export class SchemaValidationError extends TypeError implements TypedError {
  readonly type = 'schema-validation-error';
  static override [Symbol.hasInstance] = createHasInstance(
    'schema-validation-error',
    TypeError
  );
}
