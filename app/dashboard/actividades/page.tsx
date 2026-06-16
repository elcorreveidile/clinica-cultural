import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ACTIVIDADES,
  CATEGORIAS,
  SEGURO_LC_DESCUENTO,
  precioConDescuento,
} from '@/lib/actividades';
import ReservaButton from '@/components/Dashboard/ReservaButton';

export const dynamic = 'force-dynamic';

export default async function ActividadesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [seguro, reservas] = await Promise.all([
    prisma.seguroLC.findUnique({ where: { userId: user.id } }),
    prisma.reserva.findMany({
      where: { userId: user.id, estado: 'confirmada' },
      select: { actividadId: true },
    }),
  ]);
  const tieneDescuento = seguro?.cardStatus === 'active';
  const reservadas = new Set(reservas.map((r) => r.actividadId));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          📅 Actividades culturales
        </h1>
        <p className="text-clinic-blue/60">
          La agenda de inmersión de la Clínica: gastronomía, patrimonio, naturaleza, cine y más.
        </p>
      </div>

      {/* Banner descuento Seguro LC */}
      {tieneDescuento ? (
        <div className="bg-clinic-green/5 border border-clinic-green/30 rounded-2xl p-4 text-clinic-blue/80 flex items-center gap-3">
          <span className="text-2xl">🪪</span>
          <p>
            Tu <strong>Seguro LC</strong> está activo: tienes un{' '}
            <strong className="text-clinic-green">{SEGURO_LC_DESCUENTO * 100}% de descuento</strong>{' '}
            en todas las actividades.
          </p>
        </div>
      ) : (
        <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-clinic-blue/80">
            Con el <strong>Seguro LC</strong> tendrías un {SEGURO_LC_DESCUENTO * 100}% de descuento en
            estas actividades.
          </p>
          <Link
            href="/dashboard/seguro-lc"
            className="px-4 py-2 bg-clinic-gold text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-gold/90"
          >
            Activar Seguro LC
          </Link>
        </div>
      )}

      {/* Catálogo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIVIDADES.map((a) => {
          const cat = CATEGORIAS[a.categoria];
          const conDesc = precioConDescuento(a.precio);
          return (
            <div
              key={a.id}
              className="bg-white border border-clinic-gray rounded-2xl p-6 flex flex-col hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{cat.icon}</span>
                {a.nivel && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-clinic-green/10 text-clinic-green">
                    {a.nivel}
                  </span>
                )}
              </div>
              <h2 className="font-bold text-clinic-blue leading-snug">{a.nombre}</h2>
              <p className="text-xs text-clinic-gold font-semibold uppercase mt-1 mb-2">
                {cat.label}
              </p>
              <p className="text-sm text-clinic-blue/60 flex-1">{a.descripcion}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-clinic-gray">
                <span className="text-xs text-clinic-blue/50">
                  📍 {a.lugar} · {a.duracionH} h
                </span>
                <span className="text-right">
                  {tieneDescuento ? (
                    <>
                      <span className="text-clinic-blue/40 line-through text-sm mr-1">
                        {a.precio}€
                      </span>
                      <span className="font-bold text-clinic-green">{conDesc}€</span>
                    </>
                  ) : (
                    <span className="font-bold text-clinic-blue">{a.precio}€</span>
                  )}
                </span>
              </div>

              <ReservaButton actividadId={a.id} reservada={reservadas.has(a.id)} />
            </div>
          );
        })}
      </div>

      <p className="text-xs text-clinic-blue/40 text-center">
        Precios por participante (5€/hora aprox.). Las actividades forman parte del programa de la
        Clínica y pueden estar sujetas a disponibilidad y calendario.
      </p>
    </div>
  );
}
