import type { IncomingMessage } from 'node:http';
import type { HttpException } from '@httpx/exception';
import { HttpBadRequest } from '@httpx/exception';
import type { NextApiRequest } from 'next';
import type { z, ZodSchema } from 'zod';

type Params<T> = {
  onError?: (error: z.ZodError<T>) => HttpException;
};

/**
 * Parse NextApiRequest/IncomingMessage with zod schema example. Works with
 * Nextjs api handler, getServerSideProps, getStaticProps
 *
 * @throws HttpException
 */
export const parseRequestWithZod = <
  T extends ZodSchema,
  TReq extends IncomingMessage = NextApiRequest
>(
  req: TReq,
  schema: T,
  params?: Params<T>
): z.infer<T> => {
  const { onError } = params ?? {};
  const parsed = schema.safeParse(req);
  if (!parsed.success) {
    const { error } = parsed;
    if (onError) {
      throw onError(error);
    }
    const msg = parsed.error.errors
      .map((err) => `${err.path} - ${err.code}`)
      .join(', ');

    throw new HttpBadRequest({
      message: `Bad request, invalid parameter (${msg})`,
      url: req.url,
    });
  }
  return parsed.data;
};
