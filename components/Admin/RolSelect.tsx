'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const ROLES = [
  { value: 'patient', label: 'Paciente' },
  { value: 'tutor_local', label: 'Mentor (local)' },
  { value: 'professor', label: 'Profesor' },
  { value: 'admin', label: 'Administrador' },
];

export default function RolSelect({
  userId,
  rol,
  disabled,
}: {
  userId: string;
  rol: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(rol);
  const [loading, setLoading] = useState(false);

  const change = async (nuevo: string) => {
    const anterior = value;
    setValue(nuevo);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: nuevo }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo cambiar el rol.');
      }
      toast.success('Rol actualizado.');
      router.refresh();
    } catch (e) {
      setValue(anterior);
      toast.error(e instanceof Error ? e.message : 'No se pudo cambiar el rol.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      disabled={disabled || loading}
      onChange={(e) => change(e.target.value)}
      className="px-2 py-1 border border-clinic-gray rounded-lg text-xs font-semibold text-clinic-blue bg-white focus:outline-none focus:ring-2 focus:ring-clinic-red/40 disabled:opacity-60"
    >
      {ROLES.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
