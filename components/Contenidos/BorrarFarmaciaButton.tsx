'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BorrarFarmaciaButton({ id, nombre }: { id: string; nombre: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const borrar = async () => {
    if (!confirm(`¿Eliminar la farmacia «${nombre}» y todos sus recursos? No se puede deshacer.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/farmacias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Farmacia eliminada.');
      router.push('/dashboard/contenidos');
      router.refresh();
    } catch {
      toast.error('No se pudo eliminar.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={borrar}
      disabled={loading}
      className="text-xs font-semibold text-clinic-blue/40 hover:text-clinic-red disabled:opacity-50"
    >
      {loading ? 'Eliminando…' : '🗑 Eliminar farmacia'}
    </button>
  );
}
