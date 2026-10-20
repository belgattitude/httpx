export class SerializerError extends Error {
  constructor(
    message: string,
    params?: {
      cause?: Error | undefined;
    }
  ) {
    const { cause } = params ?? {};
    // the native cause option is ignored by runtimes not supporting it
    super(message, cause instanceof Error ? { cause } : undefined);
    this.name = "SerializerError";
  }
}
