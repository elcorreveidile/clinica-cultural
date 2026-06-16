'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-white px-4 text-center">
      <div>
        <div className="text-6xl mb-4">🚑</div>
        <h1 className="text-3xl font-bold text-clinic-blue mb-2">Algo salió mal</h1>
        <p className="text-clinic-blue/60 mb-6">
          La clínica ha sufrido un imprevisto. Inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-clinic-red text-white rounded-lg font-semibold"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
