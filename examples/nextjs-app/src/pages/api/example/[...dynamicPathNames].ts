import { setTimeout as sleep } from "node:timers/promises";

import { HttpBadRequest } from "@httpx/exception";
import type { NextApiRequest, NextApiResponse } from "next";

const getFakeData = () =>
  Array.from({ length: 1000 }, (_, i) => {
    return {
      id: i,
      name: `name-${i}`,
    };
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { dynamicPathNames, ...qp } = req.query;
  if (!["GET", "POST"].includes(req.method ?? "")) {
    res.status(HttpBadRequest.STATUS).json({
      error: "Method Not Allowed",
    });
  }

  await sleep(200);
  res.status(200).json({
    message: "example api",
    pathNames: dynamicPathNames,
    queryParams: qp,
    data: getFakeData(),
  });
}
