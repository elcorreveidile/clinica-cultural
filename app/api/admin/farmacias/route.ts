import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES_GESTION = ['professor', 'admin'];
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const baseFields = {
  name: z.string().min(1).max(160),
  category: z.string().max(60).optional().or(z.literal('')),
  targetLevel: z.enum(NIVELES).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
};

const crearSchema = z.object(baseFields);
const editarSchema = z.object({ id: z.string().uuid(), ...baseFields });
const borrarSchema = z.object({ id: z.string().uuid() });

async function requireGestor() {
  const user = await getSessionUser();
  if (!user || !ROLES_GESTION.includes(user.role)) return null;
  return user;
}

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

function datos(d: z.infer<typeof crearSchema> | z.infer<typeof editarSchema>) {
  return {
    name: d.name.trim(),
    category: clean(d.category),
    targetLevel: (d.targetLevel ? d.targetLevel : null) as never,
    description: clean(d.description),
  };
}

/** Crea una farmacia. Solo profesor/admin. */
export async function POST(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = crearSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de la farmacia' }, { status: 400 });

  const f = await prisma.farmacia.create({ data: datos(parsed.data) });
  return NextResponse.json({ ok: true, id: f.id });
}

/** Edita una farmacia. */
export async function PATCH(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = editarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de la farmacia' }, { status: 400 });

  await prisma.farmacia.update({ where: { id: parsed.data.id }, data: datos(parsed.data) });
  return NextResponse.json({ ok: true });
}

/** Elimina una farmacia (y sus recursos en cascada). */
export async function DELETE(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = borrarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });

  await prisma.farmacia.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ ok: true });
}
