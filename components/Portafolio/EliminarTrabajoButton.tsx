'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EliminarTrabajoButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const eliminar = async () => {
    if (!confirm('¿Eliminar este trabajo del portafolio?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/portafolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Trabajo eliminado.');
      router.refresh();
    } catch {
      toast.error('No se pudo eliminar.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={eliminar}
      disabled={loading}
      className="text-clinic-blue/40 hover:text-clinic-red text-xs font-semibold disabled:opacity-50"
      aria-label="Eliminar trabajo"
    >
      {loading ? 'Eliminando…' : '🗑 Eliminar'}
    </button>
  );
}
