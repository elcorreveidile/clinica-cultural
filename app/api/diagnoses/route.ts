import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const seccion = z.object({ correct: z.number().int().min(0), total: z.number().int().min(1) });
const schema = z.object({
  gramatica: seccion,
  auditiva: seccion,
  lectora: seccion,
  escrita: z.object({ texto: z.string().max(4000) }),
});

function pct(s: { correct: number; total: number }): number {
  return Math.round((s.correct / s.total) * 100);
}

/** Mapea el porcentaje medio a un nivel MCER. */
function scoreToLevel(p: number): (typeof LEVELS)[number] {
  if (p >= 90) return 'C2';
  if (p >= 75) return 'C1';
  if (p >= 60) return 'B2';
  if (p >= 45) return 'B1';
  if (p >= 25) return 'A2';
  return 'A1';
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }
  const { gramatica, auditiva, lectora, escrita } = parsed.data;

  const grammarScore = pct(gramatica);
  const listeningScore = pct(auditiva);
  const readingScore = pct(lectora);
  // La media de las secciones objetivas determina el nivel orientativo.
  const media = Math.round((grammarScore + listeningScore + readingScore) / 3);
  const level = scoreToLevel(media);

  const palabras = escrita.texto.trim().split(/\s+/).filter(Boolean).length;

  await prisma.$transaction([
    prisma.diagnosis.create({
      data: {
        userId: user.id,
        grammarScore,
        listeningComprehensionScore: listeningScore,
        readingComprehensionScore: readingScore,
        writtenExpressionScore: null, // se valora junto a la sesión oral
        assessedLevel: level,
        interviewNotes: `Expresión escrita del paciente (${palabras} palabras):\n${escrita.texto.trim()}\n\n(Nivel oral y expresión escrita pendientes de evaluación por un docente.)`,
        initialTreatmentPlan: `Nivel orientativo ${level}. Farmacias recomendadas según diagnóstico. Pendiente: sesión oral con docente.`,
        completedAt: new Date(),
      },
    }),
    prisma.user.update({ where: { id: user.id }, data: { currentLevel: level } }),
  ]);

  return NextResponse.json({ level, grammarScore, listeningScore, readingScore });
}
