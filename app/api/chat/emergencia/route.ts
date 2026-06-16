import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { askClaudeLinguistic } from '@/lib/claude';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tieneAccesoCompleto, LIMITE_CONSULTAS_VISITANTE } from '@/lib/planes';
import type { LanguageLevel } from '@/lib/types';

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1),
      })
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Mensajes no válidos' }, { status: 400 });
    }

    // Límite de consultas para visitantes (sin suscripción): tras 3 consultas
    // gratuitas, La Doctora propone un plan en lugar de responder.
    if (!tieneAccesoCompleto(user)) {
      const usadas = await prisma.chatLineaEmergencia.count({ where: { userId: user.id } });
      if (usadas >= LIMITE_CONSULTAS_VISITANTE) {
        return NextResponse.json({
          response: `💊 Has agotado tus **${LIMITE_CONSULTAS_VISITANTE} consultas gratuitas** con La Doctora.\n\nPara seguir con **consultas ilimitadas** y acceso a toda la clínica, échale un ojo a los planes en [Ver planes](/programa). ¡Te espero dentro! 🩺`,
          limitReached: true,
        });
      }
    }

    const { messages } = parsed.data;
    const level = user.currentLevel ?? 'B1';

    const aiResponse = await askClaudeLinguistic(messages, level);

    // Guarda el último intercambio en el historial.
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      await prisma.chatLineaEmergencia.create({
        data: {
          userId: user.id,
          userMessage: lastUserMessage.content,
          aiResponse,
          languageLevelContext: (user.currentLevel as LanguageLevel) ?? null,
        },
      });
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('chat error:', error);
    return NextResponse.json(
      { error: 'Error procesando tu consulta' },
      { status: 500 }
    );
  }
}
