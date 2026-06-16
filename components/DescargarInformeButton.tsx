'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import InformeHoja, { type InformeData } from '@/components/InformeHoja';

const PAGEBREAK = { mode: ['css', 'legacy'], before: '.salto-pagina' };

export default function DescargarInformeButton({
  data,
  filename,
  className,
}: {
  data: InformeData;
  filename: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  const descargar = async () => {
    const el = document.getElementById('informe-oculto');
    if (!el) return;
    setLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 900 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: PAGEBREAK,
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
        className={
          className ??
          'px-4 py-2 bg-clinic-red text-white rounded-lg text-sm font-semibold hover:bg-clinic-red/90 disabled:opacity-60'
        }
      >
        {loading ? 'Generando PDF…' : '📄 Descargar informe (PDF)'}
      </button>

      {/* Hoja del informe oculta (clipada a 0×0) para capturarla sin afectar al layout */}
      <div aria-hidden className="absolute w-0 h-0 overflow-hidden">
        <div className="w-[820px] bg-white">
          <InformeHoja id="informe-oculto" data={data} />
        </div>
      </div>
    </>
  );
}
