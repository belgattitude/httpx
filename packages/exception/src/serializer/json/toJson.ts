import type { HttpException } from '../../base';
import { SerializerError } from '../error';
import { convertToSerializable } from '../mapper';
import type { NativeError } from '../types';

export const toJson = (
  exception: Error | NativeError | HttpException
): string => {
  const serializable = convertToSerializable(exception);
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
