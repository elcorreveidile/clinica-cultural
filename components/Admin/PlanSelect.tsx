'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PLANES = [
  { value: '', label: 'Sin matrícula' },
  { value: 'mensual', label: 'Mensual (2 tut.)' },
  { value: 'trimestral', label: 'Trimestral (8 tut.)' },
];

export default function PlanSelect({ userId, plan }: { userId: string; plan: string | null }) {
  const router = useRouter();
  const [value, setValue] = useState(plan ?? '');
  const [loading, setLoading] = useState(false);

  const change = async (nuevo: string) => {
    const anterior = value;
    setValue(nuevo);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: nuevo }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo cambiar el plan.');
      }
      toast.success('Matrícula actualizada.');
      router.refresh();
    } catch (e) {
      setValue(anterior);
      toast.error(e instanceof Error ? e.message : 'No se pudo cambiar el plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => change(e.target.value)}
      className="px-2 py-1 border border-clinic-gray rounded-lg text-xs font-semibold text-clinic-blue bg-white focus:outline-none focus:ring-2 focus:ring-clinic-red/40 disabled:opacity-60"
    >
      {PLANES.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
