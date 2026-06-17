'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import RecursoForm, { type RecursoView } from './RecursoForm';

export default function RecursosManager({
  farmaciaId,
  recursos,
}: {
  farmaciaId: string;
  recursos: RecursoView[];
}) {
  const router = useRouter();
  const [modo, setModo] = useState<'none' | 'new' | string>('none'); // 'new' o id en edición
  const [borrando, setBorrando] = useState<string | null>(null);

  const eliminar = async (r: RecursoView) => {
    if (!confirm(`¿Eliminar el recurso «${r.titulo}»?`)) return;
    setBorrando(r.id);
    try {
      const res = await fetch('/api/admin/recursos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id }),
      });
      if (!res.ok) throw new Error();
      toast.success('Recurso eliminado.');
      router.refresh();
    } catch {
      toast.error('No se pudo eliminar.');
    } finally {
      setBorrando(null);
    }
  };

  return (
    <div className="bg-white border border-clinic-gray rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-clinic-blue">Recursos ({recursos.length})</h2>
        {modo !== 'new' && (
          <button
            onClick={() => setModo('new')}
            className="px-4 py-2 bg-clinic-red text-white text-sm font-semibold rounded-lg hover:bg-clinic-red/90"
          >
            ➕ Nuevo recurso
          </button>
        )}
      </div>

      {modo === 'new' && (
        <RecursoForm farmaciaId={farmaciaId} onDone={() => setModo('none')} />
      )}

      {recursos.length === 0 && modo !== 'new' ? (
        <p className="text-sm text-clinic-blue/50">
          Esta farmacia aún no tiene recursos en la base de datos. Crea uno o usa «Importar contenido
          base».
        </p>
      ) : (
        <ul className="divide-y divide-clinic-gray/60 mt-2">
          {recursos.map((r) => (
            <li key={r.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-clinic-blue truncate">{r.titulo}</p>
                  <p className="text-xs text-clinic-blue/50">
                    {r.tipo} · {r.formato} · {r.nivel} · {r.duracionMin} min
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setModo(modo === r.id ? 'none' : r.id)}
                    className="text-clinic-blue/60 hover:text-clinic-blue text-xs font-semibold"
                  >
                    {modo === r.id ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    onClick={() => eliminar(r)}
                    disabled={borrando === r.id}
                    className="text-clinic-blue/40 hover:text-clinic-red text-xs font-semibold disabled:opacity-50"
                  >
                    {borrando === r.id ? '…' : 'Eliminar'}
                  </button>
                </div>
              </div>
              {modo === r.id && (
                <RecursoForm farmaciaId={farmaciaId} recurso={r} onDone={() => setModo('none')} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
