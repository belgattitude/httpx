import type { HttpException } from '../../base';
import { SerializerError } from '../error/SerializerError';
import { createFromSerializable } from '../mapper';
import type { SerializableError } from '../types';

export const fromJson = (
  json: string
): Error | HttpException | SerializerError => {
  let v: SerializableError;
  try {
    v = JSON.parse(json ?? '');
  } catch (e) {
    return new SerializerError(`Can't parse json`, {
      ...(e instanceof Error ? { cause: e } : {}),
    });
  }
  return createFromSerializable(v);
};
