import { type NextRequest, NextResponse } from 'next/server';

import { serverCacheConfig } from '@/server/config/server-cache.config';

export const dynamic = 'force-dynamic';

const queryDatabase = async (query: string): Promise<string> => {
  // Simulate a database query
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Result for query: ${query}`);
    }, 2000);
  });
};

export async function GET(_req: NextRequest) {
  const key =
    '{"limit":1000,"onlyData":false,"requestUrl":"http://localhost:3000/api/referential/product-v1?limit=1000"}';

  const { lru } = serverCacheConfig;
  if (lru.has(key)) {
    return NextResponse.json(`Cached result found: ${lru.get(key)!}`, {
      status: 200,
    });
  }
  const result = await queryDatabase(
    'SELECT * FROM products WHERE limit = 1000'
  );
  lru.set(key, result);

  return NextResponse.json(`Non cached result: ${result}`, {
    status: 200,
  });
}
