import type { HttpException } from '../../base';
import { SerializerError } from '../error';
import { createFromSerializable } from '../mapper';
import type { SerializableError, SerializerParams } from '../types';

export const fromJson = (
  json: string,
  params?: SerializerParams
): Error | HttpException | SerializerError => {
  let v: SerializableError;
  try {
    v = JSON.parse(json ?? '') as unknown as SerializableError;
  } catch (e) {
    return new SerializerError(`Can't parse json`, {
      ...(e instanceof Error ? { cause: e } : {}),
    });
  }
  return createFromSerializable(v, params);
};
