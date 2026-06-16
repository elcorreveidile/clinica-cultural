import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCardNumber } from '@/lib/utils';

/** Activa (crea) el Seguro LC del usuario si aún no lo tiene. */
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const existing = await prisma.seguroLC.findUnique({ where: { userId: user.id } });
  if (existing) return NextResponse.json({ seguro: existing });

  const oneYear = new Date();
  oneYear.setFullYear(oneYear.getFullYear() + 1);

  const seguro = await prisma.seguroLC.create({
    data: {
      userId: user.id,
      cardNumber: generateCardNumber(),
      cardStatus: 'active',
      expiryDate: oneYear,
      qrCodeData: `clinicacultural.com/verificar/${user.id}`,
    },
  });

  return NextResponse.json({ seguro });
}
