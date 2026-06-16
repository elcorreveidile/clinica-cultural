'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// El profesor toma una solicitud de tutoría de pago aún sin asignar y pasa a
// ser su tutor.
export default function AceptarSolicitudButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const aceptar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tutoria', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, claim: true }),
      });
      if (!res.ok) throw new Error();
      toast.success('Solicitud aceptada. La sesión es tuya.');
      router.refresh();
    } catch {
      toast.error('No se pudo aceptar la solicitud.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={aceptar}
      disabled={loading}
      className="px-4 py-2 bg-clinic-gold text-white rounded-lg text-sm font-semibold hover:bg-clinic-gold/90 disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? 'Aceptando…' : 'Aceptar solicitud'}
    </button>
  );
}
