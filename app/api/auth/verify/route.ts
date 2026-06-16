import { NextRequest, NextResponse } from 'next/server';
import {
  consumeMagicLinkToken,
  upsertUserByEmail,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin;

  const email = token ? await consumeMagicLinkToken(token) : null;

  if (!email) {
    return NextResponse.redirect(`${baseUrl}/login?error=enlace_invalido`);
  }

  const user = await upsertUserByEmail(email);
  const sessionToken = await createSessionToken({
    id: user.id,
    email: user.email,
    role: user.role,
    currentLevel: user.currentLevel,
  });
  await setSessionCookie(sessionToken);

  return NextResponse.redirect(`${baseUrl}/dashboard`);
}
