import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/** Solicita una pareja lingüística (Enfermería LC): marca la mentoría como pendiente. */
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const seguro = await prisma.seguroLC.findUnique({ where: { userId: user.id } });
  if (!seguro) {
    return NextResponse.json(
      { error: 'Necesitas activar tu Seguro LC primero' },
      { status: 400 }
    );
  }

  if (seguro.mentorshipStatus) {
    return NextResponse.json({ seguro }); // ya solicitada/activa
  }

  const updated = await prisma.seguroLC.update({
    where: { id: seguro.id },
    data: { mentorshipStatus: 'pending', mentorshipStartDate: new Date() },
  });

  return NextResponse.json({ seguro: updated });
}
