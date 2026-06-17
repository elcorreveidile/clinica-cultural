'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function BajaUsuarioButton({
  userId,
  email,
  disabled,
}: {
  userId: string;
  email: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const baja = async () => {
    if (!confirm(`¿Dar de baja a ${email}? Se eliminarán su cuenta y todos sus datos. Esta acción no se puede deshacer.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo dar de baja.');
      }
      toast.success('Usuario dado de baja.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo dar de baja.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={baja}
      disabled={disabled || loading}
      className="text-xs font-semibold text-clinic-blue/40 hover:text-clinic-red disabled:opacity-40 disabled:hover:text-clinic-blue/40"
      title={disabled ? 'No puedes darte de baja a ti mismo' : 'Dar de baja'}
    >
      {loading ? 'Dando de baja…' : '🗑 Dar de baja'}
    </button>
  );
}
