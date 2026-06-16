'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90"
    >
      📄 Descargar / Imprimir PDF
    </button>
  );
}
