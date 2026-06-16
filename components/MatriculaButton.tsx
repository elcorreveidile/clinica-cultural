'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { PlanId } from '@/lib/stripe';

export default function MatriculaButton({
  plan,
  destacado = false,
  children,
}: {
  plan: PlanId;
  destacado?: boolean;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  const matricular = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // a Stripe Checkout
        return;
      }
      if (data.demo) {
        toast('💳 Pagos en modo demo. Configura STRIPE_SECRET_KEY para cobrar de verdad.', {
          icon: 'ℹ️',
        });
        setLoading(false);
        return;
      }
      throw new Error(data.error || 'Error');
    } catch {
      toast.error('No se pudo iniciar el pago.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={matricular}
      disabled={loading}
      className={`block w-full text-center px-6 py-3 rounded-xl font-bold transition disabled:opacity-60 ${
        destacado
          ? 'bg-clinic-red text-white hover:bg-clinic-red/90'
          : 'border border-clinic-gray text-clinic-blue hover:bg-clinic-gray/40'
      }`}
    >
      {loading ? 'Redirigiendo…' : children}
    </button>
  );
}
