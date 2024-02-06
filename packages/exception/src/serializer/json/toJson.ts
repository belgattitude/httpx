import type { HttpException } from '../../base';
import { SerializerError } from '../error/SerializerError';
import { convertToSerializable } from '../mapper';
import type { NativeError, SerializerParams } from '../types';

export const toJson = (
  exception: Error | HttpException | NativeError,
  params?: SerializerParams
): string => {
  const serializable = convertToSerializable(exception, params);
  let v: string;
  try {
    v = JSON.stringify(serializable);
  } catch (e) {
    throw new SerializerError(`Can't encode into json`, {
      ...(e instanceof Error ? { cause: e } : {}),
    });
  }
  return v;
};
