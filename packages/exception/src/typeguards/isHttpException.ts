import { HttpException } from '../base';

export const isHttpException = (error: unknown): error is HttpException => {
  return error instanceof HttpException;
};
