import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe, PLANES_MATRICULA, type PlanId } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth';

const schema = z.object({ plan: z.enum(['mensual', 'curso', 'demanda']) });

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
  }
  const plan = PLANES_MATRICULA[parsed.data.plan as PlanId];

  // Modo demo: Stripe sin configurar → el cliente muestra un aviso.
  if (!stripe) {
    return NextResponse.json({ demo: true });
  }

  const user = await getSessionUser();
  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: { name: plan.nombre },
          unit_amount: plan.amount,
        },
        quantity: 1,
      },
    ],
    customer_email: user?.email,
    success_url: `${origin}/matricula/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/programa`,
  });

  return NextResponse.json({ url: session.url });
}
