import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createMagicLinkToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/resend';

const schema = z.object({ email: z.string().email() });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const rawToken = await createMagicLinkToken(email);

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/verify?token=${rawToken}`;

    const { delivered } = await sendMagicLinkEmail({ to: email, magicLink });

    // Si no se entregó por email (modo dev) devolvemos el enlace al cliente.
    return NextResponse.json({
      ok: true,
      ...(delivered ? {} : { devMagicLink: magicLink }),
    });
  } catch (error) {
    console.error('magic-link error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
