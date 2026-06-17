import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES_GESTION = ['professor', 'admin'];

const DOSIS = ['pildora', 'jarabe', 'pomada', 'inyeccion'] as const;
const FORMATOS = ['texto', 'ejercicio', 'video', 'audio', 'interactivo'] as const;
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const baseFields = {
  title: z.string().min(1).max(200),
  dosis: z.enum(DOSIS),
  formato: z.enum(FORMATOS),
  nivel: z.enum(NIVELES),
  duracionMin: z.number().int().min(0).max(600),
  descripcion: z.string().max(500).optional().or(z.literal('')),
  contenido: z.string().max(50000).optional().or(z.literal('')),
  url: z.string().url().max(2000).optional().or(z.literal('')),
  lexico: z.record(z.string(), z.string()).optional(),
};

const crearSchema = z.object({ farmaciaId: z.string().uuid(), ...baseFields });
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
    title: d.title.trim(),
    dosis: d.dosis,
    formato: d.formato,
    difficultyLevel: d.nivel as never,
    durationMinutes: d.duracionMin,
    description: clean(d.descripcion),
    content: clean(d.contenido),
    contentUrl: clean(d.url),
    lexico: d.lexico && Object.keys(d.lexico).length > 0 ? d.lexico : undefined,
  };
}

/** Crea un recurso en una farmacia. Solo profesor/admin. */
export async function POST(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = crearSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del recurso' }, { status: 400 });

  const count = await prisma.recurso.count({ where: { farmaciaId: parsed.data.farmaciaId } });
  const r = await prisma.recurso.create({
    data: { farmaciaId: parsed.data.farmaciaId, posicion: count, ...datos(parsed.data) },
  });
  return NextResponse.json({ ok: true, id: r.id });
}

/** Edita un recurso existente. */
export async function PATCH(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = editarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del recurso' }, { status: 400 });

  await prisma.recurso.update({ where: { id: parsed.data.id }, data: datos(parsed.data) });
  return NextResponse.json({ ok: true });
}

/** Elimina un recurso. */
export async function DELETE(request: NextRequest) {
  if (!(await requireGestor())) return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  const parsed = borrarSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });

  await prisma.recurso.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ ok: true });
}
