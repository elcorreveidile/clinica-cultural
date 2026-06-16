'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface FichaInicial {
  fullName: string;
  nationality: string;
  nativeLanguage: string;
  dateOfBirth: string; // yyyy-mm-dd
  phone: string;
  bio: string;
}

export default function FichaForm({
  inicial,
  redirectTo = '/dashboard',
  submitLabel = 'Completar ficha y entrar',
}: {
  inicial: FichaInicial;
  redirectTo?: string | null;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [f, setF] = useState<FichaInicial>(inicial);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FichaInicial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.fullName.trim().length < 2) {
      toast.error('Indica tu nombre completo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      toast.success(redirectTo ? '¡Ficha completada! Bienvenido/a a la Clínica.' : 'Cambios guardados.');
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error('No pudimos guardar tu ficha. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label}>Nombre completo *</label>
        <input className={input} value={f.fullName} onChange={set('fullName')} required placeholder="Nombre y apellidos" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nacionalidad</label>
          <input className={input} value={f.nationality} onChange={set('nationality')} placeholder="p. ej. Italiana" />
        </div>
        <div>
          <label className={label}>Lengua materna</label>
          <input className={input} value={f.nativeLanguage} onChange={set('nativeLanguage')} placeholder="p. ej. Italiano" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Fecha de nacimiento</label>
          <input type="date" className={input} value={f.dateOfBirth} onChange={set('dateOfBirth')} />
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input className={input} value={f.phone} onChange={set('phone')} placeholder="+34 …" />
        </div>
      </div>

      <div>
        <label className={label}>¿Por qué quieres aprender español? ¿Cuáles son tus objetivos?</label>
        <textarea
          className={input}
          rows={4}
          value={f.bio}
          onChange={set('bio')}
          placeholder="Cuéntanos brevemente tu motivación y objetivos…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-clinic-red text-white font-bold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 transition"
      >
        {loading ? 'Guardando…' : submitLabel}
      </button>
    </form>
  );
}
