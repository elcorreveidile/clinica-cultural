'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';

interface RetoOpcion {
  id: string;
  titulo: string;
}

export default function TallerEscritura({ retos }: { retos: RetoOpcion[] }) {
  const router = useRouter();
  const [retoId, setRetoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cargandoFb, setCargandoFb] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const pedirFeedback = async () => {
    if (texto.trim().length < 3) {
      toast.error('Escribe tu poema antes de pedir feedback.');
      return;
    }
    setCargandoFb(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/poesia/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, retoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback(data.feedback);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo obtener el feedback.');
    } finally {
      setCargandoFb(false);
    }
  };

  const guardar = async () => {
    if (texto.trim().length < 3) {
      toast.error('Escribe tu poema antes de guardarlo.');
      return;
    }
    const retoTitulo = retos.find((r) => r.id === retoId)?.titulo;
    const finalTitle =
      titulo.trim() || retoTitulo || `Poema · ${new Date().toLocaleDateString('es-ES')}`;
    setGuardando(true);
    try {
      const res = await fetch('/api/portafolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: finalTitle, contentType: 'writing', description: texto }),
      });
      if (!res.ok) throw new Error();
      toast.success('Guardado en tu portafolio.');
      router.refresh();
    } catch {
      toast.error('No se pudo guardar en el portafolio.');
    } finally {
      setGuardando(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  return (
    <div className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
      <h2 className="font-bold text-clinic-blue">✍️ Tu taller de escritura</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Reto (opcional)</label>
          <select className={input} value={retoId} onChange={(e) => setRetoId(e.target.value)}>
            <option value="">Escritura libre</option>
            {retos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.titulo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Título (opcional)</label>
          <input
            className={input}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ponle un título a tu poema"
          />
        </div>
      </div>

      <div>
        <label className={label}>Tu poema</label>
        <textarea
          className={`${input} font-serif leading-relaxed`}
          rows={8}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe aquí tus versos…"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={pedirFeedback}
          disabled={cargandoFb}
          className="px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 disabled:opacity-50"
        >
          {cargandoFb ? 'La Doctora está leyendo…' : '🩺 Pedir feedback a La Doctora'}
        </button>
        <button
          onClick={guardar}
          disabled={guardando}
          className="px-5 py-2.5 border border-clinic-green text-clinic-green rounded-lg font-semibold hover:bg-clinic-green/10 disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : '📂 Guardar en mi portafolio'}
        </button>
      </div>

      {feedback && (
        <div className="bg-clinic-red/5 border border-clinic-red/20 rounded-xl p-4">
          <ChatMarkdown content={feedback} />
        </div>
      )}
    </div>
  );
}
