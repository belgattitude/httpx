import type { HttpErrorStatusCodeOrNumber } from '../types';
import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getSuper } from './getSuper';

/**
 * @internal
 */
export const getSuperArgs = (
  cls: { STATUS: HttpErrorStatusCodeOrNumber; name: string },
  msgOrParams?: HttpExceptionParams | string
): [statusCode: HttpErrorStatusCodeOrNumber, params: HttpExceptionParams] => {
  return [cls.STATUS, getSuper(cls, msgOrParams)];
};
