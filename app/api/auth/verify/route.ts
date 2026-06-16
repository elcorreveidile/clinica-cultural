import { NextRequest, NextResponse } from 'next/server';
import {
  consumeMagicLinkToken,
  upsertUserByEmail,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Redirige SIEMPRE al mismo host del que viene la petición (evita depender
  // de NEXT_PUBLIC_URL y problemas de localhost/www).
  const toDashboard = new URL('/dashboard', request.url);
  const toLogin = (reason: string) =>
    new URL(`/login?error=${reason}`, request.url);

  try {
    const token = request.nextUrl.searchParams.get('token');
    const email = token ? await consumeMagicLinkToken(token) : null;

    if (!email) {
      return NextResponse.redirect(toLogin('enlace_invalido'));
    }

    const user = await upsertUserByEmail(email);
    const sessionToken = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      currentLevel: user.currentLevel,
    });

    // La cookie se fija DIRECTAMENTE en la respuesta del redirect para que
    // viaje con él de forma fiable.
    const res = NextResponse.redirect(toDashboard);
    res.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions());
    return res;
  } catch (error) {
    console.error('verify error:', error);
    return NextResponse.redirect(toLogin('verify_failed'));
  }
}
