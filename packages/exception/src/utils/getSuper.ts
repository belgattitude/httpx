import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getMsgFromCls } from './getMsgFromCls';

/**
 * Return params applicable to parent HttpException class when calling super();
 *
 * @param name - class name without Http prefix
 * @param msgOrParams - message or params
 *
 * @internal
 */
export const getSuper = (
  name: string,
  msgOrParams?: HttpExceptionParams | string
): HttpExceptionParams => {
  const { message, ...rest } = {
    ...(typeof msgOrParams === 'string'
      ? { message: msgOrParams }
      : msgOrParams ?? {}),
  };
  return {
    ...rest,
    message: message ?? getMsgFromCls(name),
  };
};
