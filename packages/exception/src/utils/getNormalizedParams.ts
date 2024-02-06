import type { HttpExceptionParams } from '../types/HttpExceptionParams';
import { getMsgFromCls } from './getMsgFromCls';

/**
 * Return params applicable to parent HttpException class when calling super();
 *
 * @internal
 */
export const getNormalizedParams = (
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
    message: message ?? getMsgFromCls(`Http${name}`),
  };
};
