import {
  createHttpException,
  HttpBadRequest,
  isHttpException,
} from '@httpx/exception';
import { toJson } from '@httpx/exception/serializer';
import { type NextRequest, NextResponse } from 'next/server';
import { z, type ZodSchema } from 'zod';

export const dynamic = 'force-dynamic';

const zodGetSchema = z.object({
  params: z.object({
    statusCode: z
      .string()
      .transform((s) => Number.parseInt(s, 10))
      .pipe(z.number().min(100).max(599)),
  }),
});

type NextRequestOrParams = {
  params: Record<string, unknown>;
  req: NextRequest;
};

const validateNextRequest = <
  T extends ZodSchema,
  TReq extends NextRequestOrParams,
>(
  schema: T,
  reqWithParams: TReq
): z.infer<T> => {
  const parsed = schema.safeParse(reqWithParams);
  console.log('parsed', parsed);
  if (!parsed.success) {
    const error = parsed.error as unknown as z.ZodError<T>;
    const msg = error.errors
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .map((err) => `${err.path} - ${err.code}`)
      .join(', ');
    throw new HttpBadRequest({
      message: `Bad request, invalid parameter (${msg})`,
      url: reqWithParams.req.nextUrl.toString(),
    });
  }
  return parsed.data as unknown as T;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { statusCode: string } }
) {
  // Throw HttpBadRequest if didn't pass schema requirements
  try {
    const safeReq = validateNextRequest(zodGetSchema, { req, params });
    const { statusCode } = safeReq.params;

    const response = {
      statusCode: statusCode,
      url: req.url,
      method: 'GET',
    };

    return NextResponse.json(
      {
        ...response,
        _serialized: toJson(
          createHttpException(statusCode, {
            url: req.url,
            method: 'GET',
          })
        ),
      },
      {
        status: statusCode,
      }
    );
  } catch (e) {
    if (isHttpException(e)) {
      const httpException = createHttpException(e.statusCode, {
        url: req.url,
        method: 'GET',
      });
      return NextResponse.json(httpException, {
        status: e.statusCode,
      });
    }
  }

  return NextResponse.json(
    {
      time: new Date().toISOString(),
    },
    {
      status: 200,
    }
  );
}
