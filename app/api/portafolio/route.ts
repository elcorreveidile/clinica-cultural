import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { del } from '@vercel/blob';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  title: z.string().min(1).max(160),
  contentType: z.enum(['writing', 'audio', 'video', 'miniseries_episode', 'project']),
  description: z.string().max(5000).optional().or(z.literal('')),
  fileUrl: z.string().url().max(2000).optional().or(z.literal('')),
});

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

/** Crea una entrada del portafolio del paciente. */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisa los datos del trabajo' }, { status: 400 });
  }
  const d = parsed.data;

  const item = await prisma.portafolio.create({
    data: {
      userId: user.id,
      title: d.title.trim(),
      contentType: d.contentType,
      description: clean(d.description),
      fileUrl: clean(d.fileUrl),
    },
  });

  return NextResponse.json({ ok: true, id: item.id });
}

/** Elimina una entrada del portafolio (y su archivo en Blob, si lo tiene). */
export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = (await request.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 });

  const item = await prisma.portafolio.findUnique({ where: { id } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  if (item.fileUrl && item.fileUrl.includes('blob.vercel-storage.com')) {
    try {
      await del(item.fileUrl);
    } catch {
      // Si el archivo ya no existe, seguimos borrando el registro igualmente.
    }
  }

  await prisma.portafolio.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
