import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

async function handle(request: NextRequest) {
  await clearSessionCookie();
  const baseUrl = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin;
  return NextResponse.redirect(`${baseUrl}/`, { status: 303 });
}

export const GET = handle;
export const POST = handle;
