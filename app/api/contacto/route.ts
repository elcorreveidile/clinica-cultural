import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail } from '@/lib/resend';

const schema = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email().max(160),
  organizacion: z.string().max(160).optional().or(z.literal('')),
  mensaje: z.string().min(5).max(4000),
  // Campo trampa anti-spam: debe ir vacío.
  website: z.string().optional().or(z.literal('')),
});

const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined);

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisa los datos del formulario.' }, { status: 400 });
  }
  const d = parsed.data;

  // Si el honeypot viene relleno, es un bot: fingimos éxito y descartamos.
  if (d.website && d.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactEmail({
      nombre: d.nombre.trim(),
      email: d.email.trim(),
      organizacion: clean(d.organizacion),
      mensaje: d.mensaje.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'No se pudo enviar el mensaje. Inténtalo más tarde.' }, { status: 500 });
  }
}
