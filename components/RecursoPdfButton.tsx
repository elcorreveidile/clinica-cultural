'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';

export interface RecursoPdf {
  id: string;
  titulo: string;
  dosisLabel: string;
  formatoLabel: string;
  nivel: string;
  duracionMin: number;
  descripcion: string;
  contenido: string;
}

export default function RecursoPdfButton({
  recurso,
  farmaciaNombre,
}: {
  recurso: RecursoPdf;
  farmaciaNombre: string;
}) {
  const [loading, setLoading] = useState(false);
  const hojaId = `lectura-${recurso.id}`;

  const descargar = async () => {
    const el = document.getElementById(hojaId);
    if (!el) return;
    setLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `${recurso.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 900 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(el)
        .save();
    } catch {
      toast.error('No se pudo generar el PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={descargar}
        disabled={loading}
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-clinic-red text-clinic-red rounded-lg text-sm font-semibold hover:bg-clinic-red/5 disabled:opacity-60"
      >
        {loading ? 'Generando PDF…' : '📄 Descargar lectura (PDF)'}
      </button>

      {/* Ficha de lectura oculta (clipada 0×0) para el PDF */}
      <div aria-hidden className="absolute w-0 h-0 overflow-hidden">
        <div className="w-[820px] bg-white">
          <article id={hojaId} className="bg-white p-10 text-clinic-blue">
            <header className="flex items-start justify-between border-b-2 border-clinic-red pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img src="/imgs/logos/logo.png" alt="Clínica Cultural" className="h-12 w-12 object-contain" />
                <div>
                  <p className="font-heading font-bold text-clinic-red leading-tight">
                    Clínica Cultural y Lingüística
                  </p>
                  <p className="text-xs text-clinic-blue/60">Farmacia lingüística · {farmaciaNombre}</p>
                </div>
              </div>
              <div className="text-right text-xs text-clinic-blue/60">
                <p className="font-semibold text-clinic-blue">FICHA DE LECTURA</p>
                <p>
                  {recurso.dosisLabel} · {recurso.formatoLabel}
                </p>
                <p>
                  Nivel {recurso.nivel} · {recurso.duracionMin} min
                </p>
              </div>
            </header>

            <h1 className="text-2xl font-bold text-clinic-blue mb-1">{recurso.titulo}</h1>
            <p className="text-sm text-clinic-blue/60 mb-6">{recurso.descripcion}</p>

            <div className="text-sm">
              <ChatMarkdown content={recurso.contenido} />
            </div>

            <footer className="border-t border-clinic-gray pt-4 mt-8 text-xs text-clinic-blue/50">
              Clínica Cultural y Lingüística de Español · Universidad de Granada · 2026
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
