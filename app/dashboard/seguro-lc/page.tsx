import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';
import ActivarSeguroButton from '@/components/Dashboard/ActivarSeguroButton';

export default async function SeguroLCPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  const seguro = await prisma.seguroLC.findUnique({ where: { userId: user.id } });

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🪪 Seguro Lingüístico y Cultural
        </h1>
        <p className="text-clinic-blue/60">
          Tu tarjeta digital de paciente: tutoría, actividades y descuentos en Granada.
        </p>
      </div>

      {seguro ? (
        <div className="space-y-6">
          {/* Tarjeta digital */}
          <div className="relative max-w-md rounded-2xl p-6 text-white shadow-xl overflow-hidden bg-gradient-to-br from-clinic-red to-clinic-blue">
            <div className="absolute -right-6 -top-6 text-[120px] opacity-10 select-none">
              [|]
            </div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">
                  Clínica Cultural
                </p>
                <p className="font-heading text-lg font-bold">Seguro LC</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-white/20 capitalize">
                {seguro.cardStatus}
              </span>
            </div>
            <p className="text-2xl font-mono tracking-wider mb-6">
              {seguro.cardNumber}
            </p>
            <div className="flex justify-between items-end text-sm">
              <div>
                <p className="text-white/60 text-xs">Titular</p>
                <p className="font-semibold">{displayName(user)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Válida hasta</p>
                <p className="font-semibold">
                  {seguro.expiryDate
                    ? new Date(seguro.expiryDate).toLocaleDateString('es-ES')
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Beneficios */}
          <div className="bg-white border border-clinic-gray rounded-2xl p-6">
            <h2 className="font-bold text-clinic-blue mb-4">Tus beneficios</h2>
            <ul className="space-y-3 text-clinic-blue/70">
              <li className="flex items-center gap-3">
                <span className="text-clinic-green">✓</span>
                {seguro.mentoringSessionsTotal - seguro.mentoringSessionsUsed} sesiones de
                tutoría disponibles
              </li>
              <li className="flex items-center gap-3">
                <span className="text-clinic-green">✓</span>
                20% de descuento en actividades culturales
              </li>
              <li className="flex items-center gap-3">
                <span className="text-clinic-green">✓</span>
                Acceso prioritario a la Línea de Emergencia IA
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🪪</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-2">
            Aún no tienes tu Seguro LC
          </h2>
          <p className="text-clinic-blue/60 mb-6 max-w-md mx-auto">
            Actívalo para obtener tu tarjeta digital, sesiones de tutoría con un local y
            descuentos en actividades culturales.
          </p>
          <ActivarSeguroButton />
        </div>
      )}
    </div>
  );
}
