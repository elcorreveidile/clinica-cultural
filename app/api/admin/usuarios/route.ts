import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES = ['patient', 'tutor_local', 'professor', 'admin'] as const;

const cambiarSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(ROLES).optional(),
  fullName: z.string().max(120).optional(),
});

const altaSchema = z.object({
  email: z.string().email().max(160),
  role: z.enum(ROLES),
});

const bajaSchema = z.object({ userId: z.string().uuid() });

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

/** Edita un usuario existente: rol y/o nombre completo. Solo admin. */
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });

  const parsed = cambiarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  const { userId, role, fullName } = parsed.data;

  // Evita que el admin se quite a sí mismo el rol y se quede fuera.
  if (userId === admin.id && role && role !== 'admin') {
    return NextResponse.json(
      { error: 'No puedes cambiar tu propio rol de administrador.' },
      { status: 400 }
    );
  }

  const data: { role?: (typeof ROLES)[number]; fullName?: string | null } = {};
  if (role) data.role = role;
  if (fullName !== undefined) data.fullName = fullName.trim() || null;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data });
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

/** Da de baja (elimina) un usuario y limpia sus referencias. Solo admin. */
export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });

  const parsed = bajaSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  const { userId } = parsed.data;

  if (userId === admin.id) {
    return NextResponse.json({ error: 'No puedes darte de baja a ti mismo.' }, { status: 400 });
  }

  // Limpia referencias que no se borran en cascada antes de eliminar.
  await prisma.$transaction([
    prisma.sesionTutoria.deleteMany({
      where: { OR: [{ patientId: userId }, { tutorId: userId }] },
    }),
    prisma.seguroLC.updateMany({
      where: { linkedTutorId: userId },
      data: { linkedTutorId: null, mentorshipStatus: null },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ ok: true });
}
