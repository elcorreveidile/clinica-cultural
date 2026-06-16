'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SesionAcciones({
  id,
  rol,
}: {
  id: string;
  rol: 'tutor' | 'patient';
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cambiar = async (status: 'completed' | 'cancelled', confirmar?: string) => {
    if (confirmar && !confirm(confirmar)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tutoria', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      toast.success(status === 'completed' ? 'Sesión marcada como realizada.' : 'Sesión cancelada.');
      router.refresh();
    } catch {
      toast.error('No se pudo actualizar la sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {rol === 'tutor' && (
        <button
          onClick={() => cambiar('completed')}
          disabled={loading}
          className="px-3 py-1.5 bg-clinic-green text-white rounded-lg text-xs font-semibold hover:bg-clinic-green/90 disabled:opacity-50 whitespace-nowrap"
        >
          Marcar realizada
        </button>
      )}
      <button
        onClick={() => cambiar('cancelled', '¿Cancelar esta sesión?')}
        disabled={loading}
        className="px-3 py-1.5 border border-clinic-gray text-clinic-blue/70 rounded-lg text-xs font-semibold hover:bg-clinic-gray/40 disabled:opacity-50 whitespace-nowrap"
      >
        Cancelar
      </button>
    </div>
  );
}
