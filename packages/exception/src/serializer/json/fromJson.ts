import type { HttpException } from "../../base";
import { SerializerError } from "../error/SerializerError";
import { createFromSerializable } from "../mapper";
import type { SerializableError, SerializerParams } from "../types";

/**
 * Create an Error, NativeError or any HttpException from json.
 *
 * Never throws: invalid json or payloads return a SerializerError.
 */
export const fromJson = (
  json: string,
  params?: SerializerParams
): Error | HttpException | SerializerError => {
  let v: SerializableError;
  try {
    v = JSON.parse(json ?? "") as SerializableError;
  } catch (error) {
    return new SerializerError(
      `Can't parse json`,
      error instanceof Error ? { cause: error } : {}
    );
  }
  try {
    return createFromSerializable(v, params);
  } catch (error) {
    return error instanceof SerializerError
      ? error
      : new SerializerError(
          `Can't unserialize json`,
          error instanceof Error ? { cause: error } : {}
        );
  }
};
