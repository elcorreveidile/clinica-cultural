'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ReservaButton({
  actividadId,
  reservada,
}: {
  actividadId: string;
  reservada: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const estado = reservada ? 'cancelada' : 'confirmada';
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actividadId, estado }),
      });
      if (!res.ok) throw new Error();
      toast.success(reservada ? 'Reserva cancelada' : '¡Plaza reservada!');
      router.refresh();
    } catch {
      toast.error('No se pudo actualizar la reserva.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${
        reservada
          ? 'border border-clinic-red text-clinic-red hover:bg-clinic-red/5'
          : 'bg-clinic-red text-white hover:bg-clinic-red/90'
      }`}
    >
      {loading ? '…' : reservada ? '✓ Reservada · Cancelar' : 'Reservar plaza'}
    </button>
  );
}
