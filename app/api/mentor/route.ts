import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  fullName: z.string().min(2).max(120),
  nativeLanguage: z.string().max(80).optional().or(z.literal('')),
  bio: z.string().max(1000).optional().or(z.literal('')),
});

/**
 * Alta de mentor/a (estudiante local acompañante) en autoservicio: convierte
 * al usuario actual en `tutor_local` para que pueda aceptar parejas lingüísticas.
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisa los datos del formulario' }, { status: 400 });
  }
  const d = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      fullName: d.fullName.trim(),
      role: 'tutor_local',
      // No sobrescribimos con vacío si no rellenan estos campos.
      ...(d.nativeLanguage ? { nativeLanguage: d.nativeLanguage.trim() } : {}),
      ...(d.bio ? { bio: d.bio.trim() } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
