import { createHttpException, isHttpErrorStatusCode } from '@httpx/exception';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { parseRequestWithZod, withApiErrorHandler } from '@/backend';
import { zodStringToInt, ConsoleLogger } from '@/lib';

/** Example of zod schema */
const reqSchema = z.object({
  method: z.enum(['GET']),
  query: z.object({
    statusCode: zodStringToInt(z.number().min(100).max(599)),
  }),
});

const statusHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Throw HttpBadRequest if didn't pass schema requirements
  const parsed = parseRequestWithZod(req, reqSchema);

  const { statusCode } = parsed.query;

  // Throw HttpException is statusCode query param is between 400 and 599.
  if (isHttpErrorStatusCode(statusCode)) {
    throw createHttpException(statusCode, {
      url: req.url,
    });
  }

  res.status(statusCode).json({
    success: true,
    data: {
      statusCode: statusCode,
      message: `${statusCode} is a not and error code, no reason to throw.`,
    },
  });
};

export default withApiErrorHandler({
  logger: new ConsoleLogger(),
})(statusHandler);
