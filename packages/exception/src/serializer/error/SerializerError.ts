import { initProtoAndName } from '../../utils';

export class SerializerError extends Error {
  constructor(
    message: string,
    params?: {
      cause?: Error;
    }
  ) {
    const { cause } = params ?? {};
    if (cause) {
      super(message, { cause });
    } else {
      super(message);
    }
    initProtoAndName(this, SerializerError);
  }
}
