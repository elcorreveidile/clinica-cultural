'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DownloadPdfButton({
  targetId,
  filename,
}: {
  targetId: string;
  filename: string;
}) {
  const [loading, setLoading] = useState(false);

  const descargar = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    setLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'avoid-all'] },
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
    <button
      onClick={descargar}
      disabled={loading}
      className="print:hidden px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 disabled:opacity-60"
    >
      {loading ? 'Generando PDF…' : '📄 Descargar PDF'}
    </button>
  );
}
