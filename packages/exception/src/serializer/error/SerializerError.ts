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
    Object.setPrototypeOf(this, SerializerError.prototype);
    this.name = 'SerializerError';
  }
}
