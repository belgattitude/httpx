import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      time: new Date().toISOString(),
    },
    {
      status: 200,
    }
  );
}
