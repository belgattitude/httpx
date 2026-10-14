import { setTimeout as sleep } from "node:timers/promises";

import { type NextRequest, NextResponse } from "next/server";

import { serverCacheConfig } from "@/server/config/server-cache.config";

export const dynamic = "force-dynamic";

const queryDatabase = async (query: string): Promise<string> => {
  // Simulate a database query
  await sleep(2000);
  return `Result for query: ${query}`;
};

export async function GET(_req: NextRequest) {
  const key =
    '{"limit":1000,"onlyData":false,"requestUrl":"http://localhost:3000/api/referential/product-v1?limit=1000"}';

  const { lru } = serverCacheConfig;
  const cached = lru.get(key);
  if (cached !== undefined) {
    return NextResponse.json(`Cached result found: ${cached}`, {
      status: 200,
    });
  }
  const result = await queryDatabase(
    "SELECT * FROM products WHERE limit = 1000"
  );
  lru.set(key, result);

  return NextResponse.json(`Non cached result: ${result}`, {
    status: 200,
  });
}
