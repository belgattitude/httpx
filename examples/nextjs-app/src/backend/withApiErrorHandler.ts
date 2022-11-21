import type { HttpException } from '@httpx/exception';
import { isHttpException } from '@httpx/exception';
import { convertToSerializable } from '@httpx/exception/serializer';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { LoggerInterface } from '@/lib';
import { ConsoleLogger } from '@/lib';

type Params = {
  logger?: LoggerInterface;
  defaultStatusCode?: number;
};

const defaultLogger = new ConsoleLogger();

/**
 * Basic example of a nextjs api centralized error handler.
 * @see https://github.com/belgattitude/http-exception
 */
export const withApiErrorHandler = (params?: Params) => {
  const { logger = defaultLogger, defaultStatusCode = 500 } = params ?? {};
  return (handler: (req: NextApiRequest, res: NextApiResponse) => void) =>
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        await handler(req, res);
      } catch (e) {
        // @see ./logger.ts
        logger.log(`[api-error] ${req.url}`, e);

        // Example of specific error info
        const payload = isHttpException(e)
          ? {
              // add anything that can be useful from HttpException
              statusCode: e.statusCode,
              message: e.message,
              url: req.url,
              // Optionally
              debug: getDebug(e),
            }
          : {
              statusCode: defaultStatusCode,
              message: e instanceof Error ? e.message : 'Unknown error',
            };

        res.setHeader('content-type', 'application/json');
        res.status(payload.statusCode).send(
          JSON.stringify(
            {
              success: false,
              error: payload,
            },
            null,
            2
          )
        );
      }
    };
};

const getDebug = (e: HttpException) => {
  const maxStackLines = 5;
  return process.env.NODE_ENV === 'development'
    ? {
        ...convertToSerializable(e),
        stack: e.stack?.split('\n').splice(0, maxStackLines).join('\n'),
      }
    : undefined;
};
