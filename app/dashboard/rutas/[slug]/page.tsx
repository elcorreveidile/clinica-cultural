import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { rutaPorSlug } from '@/lib/rutas';
import MapaRutasDynamic from '@/components/Rutas/MapaRutasDynamic';

export const dynamic = 'force-dynamic';

export default async function RutaDetallePage({ params }: { params: { slug: string } }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const ruta = rutaPorSlug(params.slug);
  if (!ruta) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/dashboard/rutas" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
        ← Volver a las rutas
      </Link>

      <div>
        <div className="w-24 h-1.5 rounded-full mb-3" style={{ backgroundColor: ruta.color }} />
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue">{ruta.titulo}</h1>
        <p className="text-clinic-gold italic">{ruta.subtitulo}</p>
        <p className="text-clinic-blue/60 mt-2 max-w-2xl">{ruta.descripcion}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-clinic-blue/60">
          <span>🕒 {ruta.duracion}</span>
          <span>📍 {ruta.paradas.length} paradas</span>
          <span>📏 {ruta.distancia}</span>
          <span className="px-2 py-0.5 rounded-full bg-clinic-green/10 text-clinic-green font-semibold">
            Nivel {ruta.nivel}
          </span>
        </div>
      </div>

      {/* Mapa de la ruta */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-4 md:p-6">
        <h2 className="font-bold text-clinic-blue mb-1">El recorrido en el mapa</h2>
        <p className="text-clinic-blue/60 text-sm mb-4">
          Pulsa en cada punto para ver la parada.
        </p>
        <MapaRutasDynamic rutas={[ruta]} mostrarFiltros={false} zoom={15} />
      </div>

      {/* Paradas paso a paso */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6">
        <h2 className="font-bold text-clinic-blue mb-4">Las paradas, paso a paso</h2>
        <ol className="space-y-4">
          {ruta.paradas.map((p, i) => (
            <li key={`${p.nombre}-${i}`} className="flex gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-sm"
                style={{ backgroundColor: ruta.color }}
              >
                {i + 1}
              </span>
              <div className="flex-1 pb-4 border-b border-clinic-gray/60 last:border-0 last:pb-0">
                <p className="font-bold text-clinic-blue">{p.nombre}</p>
                <p className="text-sm text-clinic-blue/60">{p.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-clinic-red/5 border border-clinic-red/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-clinic-blue/70 text-sm">
          ¿Quieres practicar el vocabulario de la ruta antes de salir? La Doctora te ayuda.
        </p>
        <Link
          href="/dashboard/emergencia"
          className="px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-red/90"
        >
          🚨 Consultar a La Doctora
        </Link>
      </div>
    </div>
  );
}
