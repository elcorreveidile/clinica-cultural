import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import type { SessionUser, UserRole, LanguageLevel } from '@/lib/types';

export const SESSION_COOKIE = 'cc_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días
const MAGIC_LINK_TTL_MINUTES = 15;

/** Opciones de la cookie de sesión, reutilizables al fijarla en una respuesta. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET no configurado (mínimo 16 caracteres).');
  }
  return new TextEncoder().encode(secret);
}

// ───────────────────────── Magic Link ─────────────────────────

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Crea un token de un solo uso para el email indicado y devuelve el token
 * en claro (solo se guarda su hash en la base de datos).
 */
export async function createMagicLinkToken(email: string): Promise<string> {
  const raw = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { tokenHash: hashToken(raw), email, expiresAt },
  });

  return raw;
}

/**
 * Valida y consume un token de Magic Link. Devuelve el email asociado o null
 * si el token no existe, ya fue usado o expiró.
 */
export async function consumeMagicLinkToken(raw: string): Promise<string | null> {
  if (!raw) return null;

  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(raw) },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.email;
}

/** Lista de emails (env ADMIN_EMAILS, separados por comas) con rol admin. */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Crea (o recupera) el usuario asociado al email tras verificar el token.
 *  Si el email está en ADMIN_EMAILS, se asegura el rol admin. */
export async function upsertUserByEmail(email: string) {
  const isAdmin = adminEmails().includes(email.toLowerCase());
  return prisma.user.upsert({
    where: { email },
    update: isAdmin ? { role: 'admin' } : {},
    create: { email, role: isAdmin ? 'admin' : 'patient' },
  });
}

// ───────────────────────── Sesión (JWT cookie) ─────────────────────────

export async function createSessionToken(user: {
  id: string;
  email: string;
  role: UserRole;
  currentLevel: LanguageLevel | null;
}): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
    currentLevel: user.currentLevel,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

/** Escribe la cookie de sesión (solo en Route Handlers / Server Actions). */
export async function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

/**
 * Devuelve el usuario de la sesión actual leyendo y verificando la cookie.
 * null si no hay sesión válida.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const userId = payload.sub;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      currentLevel: user.currentLevel,
    };
  } catch {
    return null;
  }
}
