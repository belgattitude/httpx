import { type HttpException, isHttpException } from "@httpx/exception";
import { convertToSerializable } from "@httpx/exception/serializer";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import { ConsoleLogger, type LoggerInterface } from "@/lib";

type Params = {
  defaultStatusCode?: number;
  logger?: LoggerInterface;
};

const defaultLogger = new ConsoleLogger();

const getDebug = (e: HttpException) => {
  const maxStackLines = 5;
  return process.env.NODE_ENV === "development"
    ? {
        ...convertToSerializable(e),
        stack: e.stack?.split("\n").splice(0, maxStackLines).join("\n"),
      }
    : undefined;
};

/**
 * Basic example of a nextjs api centralized error handler.
 * @see https://github.com/belgattitude/httpx
 */
export const withApiErrorHandler = (params?: Params) => {
  const { defaultStatusCode = 500, logger = defaultLogger } = params ?? {};
  return (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        await handler(req, res);
      } catch (error) {
        // @see ./logger.ts
        logger.log(`[api-error] ${req.url}`, error);

        // Example of specific error info
        const payload = isHttpException(error)
          ? {
              // Optionally
              debug: getDebug(error),
              message: error.message,
              // add anything that can be useful from HttpException
              statusCode: error.statusCode,
              url: req.url,
            }
          : {
              message: error instanceof Error ? error.message : "Unknown error",
              statusCode: defaultStatusCode,
            };

        res.setHeader("content-type", "application/json");
        res.status(payload.statusCode).send(
          JSON.stringify(
            {
              error: payload,
              success: false,
            },
            null,
            2
          )
        );
      }
    };
};
