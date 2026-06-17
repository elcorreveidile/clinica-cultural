import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// La mentoría (pareja lingüística) es con gente local (de la UGR u otras
// personas de la ciudad), no con el profesorado.
const ROLES_MENTOR = ['tutor_local', 'admin'];

const schema = z.object({ seguroId: z.string().uuid() });

/** Asigna al mentor/a local actual como pareja lingüística de un Seguro LC. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!ROLES_MENTOR.includes(user.role)) {
    return NextResponse.json({ error: 'Solo los mentores locales pueden aceptar parejas' }, { status: 403 });
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
