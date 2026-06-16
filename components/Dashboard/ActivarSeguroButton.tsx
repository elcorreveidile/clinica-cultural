'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ActivarSeguroButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const activar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seguro-lc', { method: 'POST' });
      if (!res.ok) throw new Error();
      toast.success('¡Seguro LC activado!');
      router.refresh();
    } catch {
      toast.error('No pudimos activar tu seguro.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={activar}
      disabled={loading}
      className="px-6 py-3 bg-clinic-red text-white font-bold rounded-xl hover:bg-clinic-red/90 disabled:opacity-50"
    >
      {loading ? 'Activando…' : 'Activar mi Seguro LC'}
    </button>
  );
}
