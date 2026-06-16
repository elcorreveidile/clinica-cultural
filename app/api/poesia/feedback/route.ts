import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { feedbackPoetico } from '@/lib/claude';
import { retoPorId } from '@/lib/poesia';

const schema = z.object({
  texto: z.string().min(1).max(4000),
  retoId: z.string().max(60).optional().or(z.literal('')),
});

/** Devuelve el feedback poético de La Doctora sobre el texto del estudiante. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Escribe algo antes de pedir feedback.' }, { status: 400 });
  }

  const reto = retoPorId(parsed.data.retoId);
  const feedback = await feedbackPoetico({
    texto: parsed.data.texto,
    nivel: user.currentLevel ?? 'B1',
    reto: reto?.titulo,
  });

  return NextResponse.json({ feedback });
}
