import { createHttpException, isHttpErrorStatusCode } from '@httpx/exception';
import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { ConsoleLogger } from '@/lib';
import { parseRequestWithZod, withApiErrorHandler } from '@/server';

/** Example of zod schema */
const reqSchema = z.object({
  method: z.enum(['GET']),
  query: z.object({
    statusCode: z
      .string()
      .transform((s) => parseInt(s, 10))
      .pipe(z.number().min(100).max(599)),
  }),
});

const statusHandler: NextApiHandler = async (req, res) => {
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
    data: {
      message: `${statusCode} is a not and error code, no reason to throw.`,
      statusCode: statusCode,
    },
    success: true,
  });
};

export default withApiErrorHandler({
  logger: new ConsoleLogger(),
})(statusHandler);
