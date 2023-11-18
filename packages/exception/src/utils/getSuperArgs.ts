import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from './getSuper';

export const getSuperArgs = (
  cls: { STATUS: number; name: string },
  msgOrParams?: HttpExceptionParams | string
): [statusCode: number, params: HttpExceptionParams] => {
  return [cls.STATUS, getSuper(cls.name, msgOrParams)];
};
