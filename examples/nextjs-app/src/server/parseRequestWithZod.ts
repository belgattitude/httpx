import { HttpBadRequest, type HttpException } from '@httpx/exception';
import type { NextRequest } from 'next/server';
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
  TReq extends NextRequest = NextRequest,
>(
  req: TReq,
  schema: T,
  params?: Params<T>
): z.infer<T> => {
  const { onError } = params ?? {};
  const parsed = schema.safeParse(req);
  if (!parsed.success) {
    const error = parsed.error as unknown as z.ZodError<T>;
    if (onError) {
      throw onError(error);
    }
    const msg = error.errors
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .map((err) => `${err.path} - ${err.code}`)
      .join(', ');

    throw new HttpBadRequest({
      message: `Bad request, invalid parameter (${msg})`,
      url: req.url,
    });
  }
  return parsed.data as unknown as T;
};
