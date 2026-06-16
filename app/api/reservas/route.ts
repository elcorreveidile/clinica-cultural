import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ACTIVIDADES } from '@/lib/actividades';

const schema = z.object({
  actividadId: z.string(),
  estado: z.enum(['confirmada', 'cancelada']),
});

/** Reserva o cancela una actividad del catálogo para el usuario. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }
  const { actividadId, estado } = parsed.data;

  if (!ACTIVIDADES.some((a) => a.id === actividadId)) {
    return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
  }

  const reserva = await prisma.reserva.upsert({
    where: { userId_actividadId: { userId: user.id, actividadId } },
    update: { estado },
    create: { userId: user.id, actividadId, estado },
  });

  return NextResponse.json({ reserva });
}
