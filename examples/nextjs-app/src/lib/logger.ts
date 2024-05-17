/**
 * Simplified example for http-exception logging.
 *
 * Shows a possible way to conditionally log HttpException specific info (context, status codes...).
 *
 * @see https://github.com/belgattitude/httpx
 */
import { isHttpException } from '@httpx/exception';

export interface LoggerInterface {
  log: <T = unknown>(message: string, payload?: T) => void;
}

export class ConsoleLogger implements LoggerInterface {
  log(message: string, payload?: unknown) {
    if (isHttpException(payload)) {
      const { name, statusCode, url } = payload;
      console.error(message, { name, statusCode, url });
    } else {
      console.log(message);
    }
  }
}
