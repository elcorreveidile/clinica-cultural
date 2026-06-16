import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

export const stripeConfigured = Boolean(
  key && key.startsWith('sk_') && !key.includes('REEMPLAZA')
);

export const stripe = stripeConfigured ? new Stripe(key as string) : null;

// Planes de matrícula (importes en céntimos, EUR).
export const PLANES_MATRICULA = {
  mensual: { nombre: 'Matrícula mensual · Clínica Cultural', amount: 35000 },
  curso: { nombre: 'Curso completo (3 meses) · Clínica Cultural', amount: 94500 },
  demanda: { nombre: 'Servicio a demanda (1 hora) · Clínica Cultural', amount: 500 },
} as const;

export type PlanId = keyof typeof PLANES_MATRICULA;
