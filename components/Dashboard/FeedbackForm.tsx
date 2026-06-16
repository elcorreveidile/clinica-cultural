'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FeedbackForm({ portafolioId }: { portafolioId: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/profesor/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portafolioId, feedback: texto.trim() }),
      });
      if (!res.ok) throw new Error();
      toast.success('Feedback enviado');
      router.refresh();
    } catch {
      toast.error('No se pudo enviar el feedback.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={enviar} className="flex flex-col sm:flex-row gap-2">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe tu feedback…"
        className="flex-1 px-3 py-2 border border-clinic-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-clinic-green/40"
      />
      <button
        type="submit"
        disabled={loading || !texto.trim()}
        className="px-4 py-2 bg-clinic-green text-white rounded-lg text-sm font-semibold hover:bg-clinic-green/90 disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? 'Enviando…' : 'Enviar feedback'}
      </button>
    </form>
  );
}
