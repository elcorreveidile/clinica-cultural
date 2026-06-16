import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const schema = z.object({
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
});

/** Mapea el porcentaje de aciertos a un nivel MCER. */
function scoreToLevel(pct: number): (typeof LEVELS)[number] {
  if (pct >= 90) return 'C2';
  if (pct >= 75) return 'C1';
  if (pct >= 60) return 'B2';
  if (pct >= 45) return 'B1';
  if (pct >= 25) return 'A2';
  return 'A1';
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }

  const { correct, total } = parsed.data;
  const pct = Math.round((correct / total) * 100);
  const level = scoreToLevel(pct);

  await prisma.$transaction([
    prisma.diagnosis.create({
      data: {
        userId: user.id,
        grammarScore: pct,
        assessedLevel: level,
        completedAt: new Date(),
        initialTreatmentPlan: `Plan inicial para nivel ${level}: farmacias recomendadas según diagnóstico.`,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { currentLevel: level },
    }),
  ]);

  return NextResponse.json({ level, pct });
}
