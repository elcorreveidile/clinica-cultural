import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { RUTAS } from '@/lib/rutas';
import MapaRutasDynamic from '@/components/Rutas/MapaRutasDynamic';

export const dynamic = 'force-dynamic';

export default async function RutasPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🗺️ Rutas culturales
        </h1>
        <p className="text-clinic-blue/60">
          Recorre Granada y practica español por el camino. Cada parada incluye su léxico.
        </p>
      </div>

      {/* Tarjetas de rutas */}
      <div className="grid md:grid-cols-3 gap-4">
        {RUTAS.map((ruta) => (
          <Link
            key={ruta.slug}
            href={`/dashboard/rutas/${ruta.slug}`}
            className="bg-white border border-clinic-gray rounded-2xl p-6 flex flex-col hover:shadow-md hover:border-clinic-gold/50 transition"
          >
            <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: ruta.color }} />
            <h2 className="text-lg font-bold text-clinic-blue">{ruta.titulo}</h2>
            <p className="text-clinic-gold text-sm italic mb-2">{ruta.subtitulo}</p>
            <p className="text-sm text-clinic-blue/60 flex-1">{ruta.descripcion}</p>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-clinic-gray text-xs text-clinic-blue/60">
              <span>🕒 {ruta.duracion}</span>
              <span>📍 {ruta.paradas.length} paradas</span>
              <span>📏 {ruta.distancia}</span>
              <span className="px-2 py-0.5 rounded-full bg-clinic-green/10 text-clinic-green font-semibold">
                Nivel {ruta.nivel}
              </span>
            </div>
            <span className="mt-3 text-clinic-red font-semibold text-sm">Ver ruta y paradas →</span>
          </Link>
        ))}
      </div>

      {/* Mapa interactivo */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-4 md:p-6">
        <h2 className="font-bold text-clinic-blue mb-1">Mapa interactivo</h2>
        <p className="text-clinic-blue/60 text-sm mb-4">
          Pulsa en los puntos para ver cada parada. Filtra por ruta con los botones.
        </p>
        <MapaRutasDynamic rutas={RUTAS} />
      </div>
    </div>
  );
}
