import type { HttpException } from "../../base";
import { SerializerError } from "../error/SerializerError";
import { createFromSerializable } from "../mapper";
import type { SerializableError, SerializerParams } from "../types";

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
  return createFromSerializable(v, params);
};
