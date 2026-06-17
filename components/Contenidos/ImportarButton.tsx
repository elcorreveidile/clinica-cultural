'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ImportarButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const importar = async () => {
    if (!confirm('¿Importar a la base de datos el contenido base de las farmacias? No duplica lo que ya exista.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contenidos/importar', { method: 'POST' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(`Importado: ${d.creados} creados, ${d.omitidos} ya existían.`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo importar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={importar}
      disabled={loading}
      className="px-5 py-2.5 border border-clinic-green text-clinic-green rounded-lg font-semibold hover:bg-clinic-green/10 disabled:opacity-50"
    >
      {loading ? 'Importando…' : '⬇️ Importar contenido base'}
    </button>
  );
}
