'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AceptarParejaButton({ seguroId }: { seguroId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const aceptar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profesor/asignar-pareja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seguroId }),
      });
      if (!res.ok) throw new Error();
      toast.success('¡Pareja aceptada! Ya podéis empezar.');
      router.refresh();
    } catch {
      toast.error('No se pudo aceptar la pareja.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={aceptar}
      disabled={loading}
      className="px-4 py-2 bg-clinic-green text-white rounded-lg text-sm font-semibold hover:bg-clinic-green/90 disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? 'Aceptando…' : 'Aceptar pareja'}
    </button>
  );
}
