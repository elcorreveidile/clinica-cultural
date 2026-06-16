'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ROLES } from './RolSelect';

export default function AltaUsuarioForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('professor');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Indica un email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo dar de alta.');
      }
      toast.success('Usuario dado de alta con su rol.');
      setEmail('');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo dar de alta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-clinic-gray rounded-2xl p-6">
      <h2 className="font-bold text-clinic-blue mb-1">Dar de alta un usuario</h2>
      <p className="text-sm text-clinic-blue/60 mb-4">
        Asigna un rol por email. Si la persona aún no tiene cuenta, se crea con ese rol y lo tendrá al
        entrar con su enlace mágico.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          className="flex-1 px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2.5 border border-clinic-gray rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-clinic-red/40"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-clinic-red text-white font-semibold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Guardando…' : 'Dar de alta'}
        </button>
      </div>
    </form>
  );
}
