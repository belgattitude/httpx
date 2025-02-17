import { HttpBadRequest } from '@httpx/exception';
import type { NextApiRequest, NextApiResponse } from 'next';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getFakeData = async () => {
  return Array.from({ length: 1000 }).map((_, i) => ({
    id: i,
    name: `name-${i}`,
  }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dynamicPathNames, ...qp } = req.query;
  if (!['GET', 'POST'].includes(req.method!)) {
    res.status(HttpBadRequest.STATUS).json({
      error: 'Method Not Allowed',
    });
  }

  const _sleep = await sleep(200);
  res.status(200).json({
    message: 'example api',
    pathNames: dynamicPathNames,
    queryParams: qp,
    data: await getFakeData(),
  });
}
