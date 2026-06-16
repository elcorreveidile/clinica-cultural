import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES_TUTOR = ['professor', 'tutor_local', 'admin'];

const schema = z.object({ seguroId: z.string().uuid() });

/** Asigna al profesor/tutor actual como pareja lingüística de un Seguro LC. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!ROLES_TUTOR.includes(user.role)) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }

  const seguro = await prisma.seguroLC.update({
    where: { id: parsed.data.seguroId },
    data: {
      linkedTutorId: user.id,
      mentorshipStatus: 'active',
      mentorshipStartDate: new Date(),
    },
  });

  return NextResponse.json({ seguro });
}
