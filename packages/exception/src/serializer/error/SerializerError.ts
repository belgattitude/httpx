import { supportsErrorCause } from '../../support/supportsErrorCause';

export class SerializerError extends Error {
  constructor(
    message: string,
    params?: {
      cause?: Error;
    }
  ) {
    const { cause } = params ?? {};
    super(message);
    if (supportsErrorCause() && cause instanceof Error) {
      this.cause = cause;
    }
    Object.setPrototypeOf(this, SerializerError.prototype);
    this.name = 'SerializerError';
  }
}
