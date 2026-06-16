import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';
import SolicitarParejaButton from '@/components/Dashboard/SolicitarParejaButton';

export const dynamic = 'force-dynamic';

export default async function EnfermeriaLCPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const seguro = await prisma.seguroLC.findUnique({
    where: { userId: user.id },
    include: { linkedTutor: true },
  });

  const estado = seguro?.mentorshipStatus ?? null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🤝 Enfermería LC
        </h1>
        <p className="text-clinic-blue/60">
          Mentoría y <strong>parejas lingüísticas</strong>: te emparejamos con un estudiante local
          para que aprendáis el uno del otro dentro y fuera del aula.
        </p>
      </div>

      {/* En qué consiste */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ['🗓️ Encuentros regulares', 'Quedáis con frecuencia para practicar y resolver dudas.'],
          ['🌍 Integración real', 'Tu pareja te ayuda a moverte por la vida cotidiana y académica de la UGR.'],
          ['🔁 Beneficio mutuo', 'Tú practicas español; tu pareja, su idioma y cultura.'],
        ].map(([t, d]) => (
          <div key={t} className="bg-white border border-clinic-gray rounded-2xl p-5">
            <h2 className="font-bold text-clinic-blue text-sm">{t}</h2>
            <p className="text-sm text-clinic-blue/60 mt-1">{d}</p>
          </div>
        ))}
      </div>

      {/* Estado del usuario */}
      {!seguro ? (
        <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-clinic-blue">Necesitas tu Seguro LC</h3>
            <p className="text-clinic-blue/60 text-sm">
              El programa de parejas lingüísticas está incluido en tu Seguro LC.
            </p>
          </div>
          <Link
            href="/dashboard/seguro-lc"
            className="px-5 py-2.5 bg-clinic-gold text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-gold/90"
          >
            Activar Seguro LC
          </Link>
        </div>
      ) : estado === null ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-2">Solicita tu pareja lingüística</h2>
          <p className="text-clinic-blue/60 max-w-md mx-auto mb-5">
            Te emparejaremos con un estudiante local según tu nivel e intereses. Incluye{' '}
            {seguro.mentoringSessionsTotal} sesiones de acompañamiento.
          </p>
          <SolicitarParejaButton />
        </div>
      ) : estado === 'pending' ? (
        <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">⏳</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-1">Buscando tu pareja…</h2>
          <p className="text-clinic-blue/60">
            Hemos recibido tu solicitud. Te avisaremos en cuanto tengas pareja asignada.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-clinic-gray rounded-2xl p-6">
          <h2 className="font-bold text-clinic-blue mb-4">Tu pareja lingüística</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-clinic-green text-white flex items-center justify-center font-bold text-lg uppercase">
              {seguro.linkedTutor ? displayName(seguro.linkedTutor).charAt(0) : '?'}
            </div>
            <div>
              <p className="font-semibold text-clinic-blue">
                {seguro.linkedTutor ? displayName(seguro.linkedTutor) : 'Pendiente de asignar'}
              </p>
              <p className="text-sm text-clinic-blue/50 capitalize">
                Mentoría {estado === 'active' ? 'activa' : 'completada'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-clinic-blue/60">Sesiones de acompañamiento</span>
            <span className="font-semibold text-clinic-blue">
              {seguro.mentoringSessionsUsed} / {seguro.mentoringSessionsTotal} usadas
            </span>
          </div>
          <div className="h-2 bg-clinic-gray rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-clinic-green"
              style={{
                width: `${(seguro.mentoringSessionsUsed / seguro.mentoringSessionsTotal) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
