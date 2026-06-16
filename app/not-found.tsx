import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-white px-4 text-center">
      <div>
        <div className="text-6xl mb-4">🩹</div>
        <h1 className="text-3xl font-bold text-clinic-blue mb-2">Página no encontrada</h1>
        <p className="text-clinic-blue/60 mb-6">
          Esta sala de la clínica no existe o ha sido trasladada.
        </p>
        <Link href="/" className="px-6 py-3 bg-clinic-red text-white rounded-lg font-semibold">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
