import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES = ['patient', 'tutor_local', 'professor', 'admin'] as const;

const cambiarSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(ROLES),
});

const altaSchema = z.object({
  email: z.string().email().max(160),
  role: z.enum(ROLES),
});

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

/** Cambia el rol de un usuario existente. Solo admin. */
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });

  const parsed = cambiarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });

  // Evita que el admin se quite a sí mismo el rol y se quede fuera.
  if (parsed.data.userId === admin.id && parsed.data.role !== 'admin') {
    return NextResponse.json(
      { error: 'No puedes cambiar tu propio rol de administrador.' },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });
  return NextResponse.json({ ok: true });
}

/** Da de alta (o actualiza) un usuario por email con un rol. Solo admin. */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });

  const parsed = altaSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Email o rol no válidos' }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: parsed.data.role },
    create: { email, role: parsed.data.role },
  });

  return NextResponse.json({ ok: true, id: user.id });
}
