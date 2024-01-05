import { supportsErrorCause } from '../../support/supportsErrorCause';
import { initProtoAndName } from '../../utils';

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
    initProtoAndName(this, SerializerError);
  }
}
