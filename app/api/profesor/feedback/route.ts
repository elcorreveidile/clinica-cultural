import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ROLES_TUTOR = ['professor', 'tutor_local', 'admin'];

const schema = z.object({
  portafolioId: z.string().uuid(),
  feedback: z.string().min(1).max(2000),
});

/** Guarda el feedback del profesor en un trabajo del portafolio. */
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

  const item = await prisma.portafolio.update({
    where: { id: parsed.data.portafolioId },
    data: {
      professorFeedback: parsed.data.feedback,
      professorFeedbackDate: new Date(),
    },
  });

  return NextResponse.json({ item });
}
