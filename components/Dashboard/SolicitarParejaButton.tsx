'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SolicitarParejaButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const solicitar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enfermeria', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('¡Solicitud enviada! Te emparejaremos pronto.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo enviar la solicitud.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={solicitar}
      disabled={loading}
      className="px-6 py-3 bg-clinic-red text-white font-bold rounded-xl hover:bg-clinic-red/90 disabled:opacity-50"
    >
      {loading ? 'Enviando…' : 'Solicitar pareja lingüística'}
    </button>
  );
}
