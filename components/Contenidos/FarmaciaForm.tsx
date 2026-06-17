'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NIVELES = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface FarmaciaInicial {
  id?: string;
  name: string;
  category: string;
  targetLevel: string;
  description: string;
}

export default function FarmaciaForm({ inicial }: { inicial?: FarmaciaInicial }) {
  const router = useRouter();
  const editar = Boolean(inicial?.id);
  const [name, setName] = useState(inicial?.name ?? '');
  const [category, setCategory] = useState(inicial?.category ?? '');
  const [targetLevel, setTargetLevel] = useState(inicial?.targetLevel ?? '');
  const [description, setDescription] = useState(inicial?.description ?? '');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 1) {
      toast.error('Ponle un nombre a la farmacia.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/farmacias', {
        method: editar ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inicial?.id, name, category, targetLevel, description }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo guardar.');
      }
      toast.success(editar ? 'Farmacia actualizada.' : 'Farmacia creada.');
      if (!editar) {
        setName('');
        setCategory('');
        setTargetLevel('');
        setDescription('');
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';
  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';

  return (
    <form onSubmit={submit} className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
      <h2 className="font-bold text-clinic-blue">{editar ? 'Editar farmacia' : 'Nueva farmacia'}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nombre *</label>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} required placeholder="p. ej. Clínica del habla" />
        </div>
        <div>
          <label className={label}>Categoría</label>
          <input
            className={input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="p. ej. enfermeria, olores-sabores…"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nivel objetivo</label>
          <select className={input} value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}>
            {NIVELES.map((n) => (
              <option key={n} value={n}>
                {n || '—'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Descripción</label>
          <input className={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción" />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-clinic-red text-white font-semibold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50"
      >
        {loading ? 'Guardando…' : editar ? 'Guardar cambios' : 'Crear farmacia'}
      </button>
    </form>
  );
}
