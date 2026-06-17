'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NombreEditable({
  userId,
  nombre,
}: {
  userId: string;
  nombre: string | null;
}) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nombre ?? '');
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fullName: valor }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo guardar.');
      }
      toast.success('Nombre actualizado.');
      setEditando(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  if (!editando) {
    return (
      <button
        onClick={() => setEditando(true)}
        className="text-left text-clinic-blue/70 hover:text-clinic-blue group"
        title="Editar nombre"
      >
        {nombre || <span className="text-clinic-blue/40">—</span>}{' '}
        <span className="opacity-0 group-hover:opacity-100 text-xs text-clinic-blue/40">✏️</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        autoFocus
        className="w-36 px-2 py-1 border border-clinic-gray rounded text-xs focus:outline-none focus:ring-2 focus:ring-clinic-red/40"
        placeholder="Nombre y apellidos"
      />
      <button
        onClick={guardar}
        disabled={loading}
        className="text-clinic-green text-xs font-semibold disabled:opacity-50"
      >
        {loading ? '…' : 'Guardar'}
      </button>
      <button
        onClick={() => {
          setValor(nombre ?? '');
          setEditando(false);
        }}
        className="text-clinic-blue/40 text-xs"
      >
        ✕
      </button>
    </div>
  );
}
