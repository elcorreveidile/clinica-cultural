import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const opt = (max: number) => z.string().max(max).optional().or(z.literal(''));

const schema = z.object({
  fullName: z.string().min(2).max(120),
  nationality: opt(80),
  nativeLanguage: opt(80),
  dateOfBirth: opt(20), // yyyy-mm-dd
  phone: opt(40),
  bio: opt(1000),
  // Foto como data URL (se recorta y comprime en el cliente). ~3 MB de margen.
  profilePictureUrl: z
    .string()
    .max(3_000_000)
    .refine((v) => v === '' || v.startsWith('data:image/'), 'Imagen no válida')
    .optional()
    .or(z.literal('')),
});

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

/** Guarda la ficha del paciente (perfil) tras el primer acceso. */
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
      nationality: clean(d.nationality),
      nativeLanguage: clean(d.nativeLanguage),
      phone: clean(d.phone),
      bio: clean(d.bio),
      profilePictureUrl: clean(d.profilePictureUrl),
      dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
