import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';
import SolicitarParejaButton from '@/components/Dashboard/SolicitarParejaButton';
import HazteMentor from '@/components/Enfermeria/HazteMentor';
import AceptarParejaButton from '@/components/Enfermeria/AceptarParejaButton';

export const dynamic = 'force-dynamic';

const ROLES_MENTOR = ['tutor_local', 'professor', 'admin'];

const CONSISTE = [
  ['🗓️ Encuentros regulares', 'Quedáis con frecuencia para practicar y resolver dudas.'],
  ['🌍 Integración real', 'La pareja ayuda a moverse por la vida cotidiana y académica de la UGR.'],
  ['🔁 Beneficio mutuo', 'El paciente practica español; el mentor, su idioma y cultura.'],
];

export default async function EnfermeriaLCPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const esMentor = ROLES_MENTOR.includes(user.role);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { fullName: true, nativeLanguage: true },
  });

  // Datos del lado del mentor.
  const pendientes = esMentor
    ? await prisma.seguroLC.findMany({
        where: { mentorshipStatus: 'pending', linkedTutorId: null },
        include: { user: true },
        orderBy: { mentorshipStartDate: 'asc' },
      })
    : [];
  const misParejas = esMentor
    ? await prisma.seguroLC.findMany({
        where: { linkedTutorId: user.id },
        include: { user: true },
      })
    : [];

  // Datos del lado del paciente.
  const seguro = esMentor
    ? null
    : await prisma.seguroLC.findUnique({
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
          Mentoría y <strong>parejas lingüísticas</strong>: emparejamos a cada estudiante
          internacional con un estudiante local para que aprendáis el uno del otro dentro y fuera del
          aula.
        </p>
      </div>

      {/* En qué consiste */}
      <div className="grid sm:grid-cols-3 gap-4">
        {CONSISTE.map(([t, d]) => (
          <div key={t} className="bg-white border border-clinic-gray rounded-2xl p-5">
            <h2 className="font-bold text-clinic-blue text-sm">{t}</h2>
            <p className="text-sm text-clinic-blue/60 mt-1">{d}</p>
          </div>
        ))}
      </div>

      {esMentor ? (
        /* ───────────────── Vista de mentor/a ───────────────── */
        <div className="space-y-6">
          {/* Solicitudes de pareja pendientes */}
          <div className="bg-white border border-clinic-gray rounded-2xl p-6">
            <h2 className="font-bold text-clinic-blue mb-4">Solicitudes de pareja</h2>
            {pendientes.length === 0 ? (
              <p className="text-clinic-blue/50 text-sm">
                Ahora mismo no hay solicitudes pendientes. Te avisaremos cuando un estudiante busque
                pareja. ¡Gracias por acompañar! 🙌
              </p>
            ) : (
              <ul className="space-y-3">
                {pendientes.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 border border-clinic-gray rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-clinic-gold text-white flex items-center justify-center font-bold uppercase shrink-0">
                        {displayName(s.user).charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-clinic-blue truncate">{displayName(s.user)}</p>
                        <p className="text-xs text-clinic-blue/50">
                          {s.user.currentLevel ? `Nivel ${s.user.currentLevel}` : 'Nivel por evaluar'}
                          {s.user.nativeLanguage ? ` · Habla ${s.user.nativeLanguage}` : ''}
                        </p>
                      </div>
                    </div>
                    <AceptarParejaButton seguroId={s.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Parejas que ya acompaña */}
          <div className="bg-white border border-clinic-gray rounded-2xl p-6">
            <h2 className="font-bold text-clinic-blue mb-4">Tus parejas</h2>
            {misParejas.length === 0 ? (
              <p className="text-clinic-blue/50 text-sm">
                Todavía no acompañas a nadie. Acepta una solicitud para empezar.
              </p>
            ) : (
              <ul className="space-y-3">
                {misParejas.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 border border-clinic-gray rounded-xl p-4">
                    <div className="w-11 h-11 rounded-full bg-clinic-green text-white flex items-center justify-center font-bold uppercase shrink-0">
                      {displayName(s.user).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-clinic-blue truncate">{displayName(s.user)}</p>
                      <p className="text-xs text-clinic-blue/50">
                        {s.mentorshipStatus === 'active' ? 'Mentoría activa' : 'Mentoría completada'}
                        {s.user.nativeLanguage ? ` · Habla ${s.user.nativeLanguage}` : ''}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-clinic-blue">
                      {s.mentoringSessionsUsed} / {s.mentoringSessionsTotal} sesiones
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        /* ───────────────── Vista de paciente ───────────────── */
        <div className="space-y-6">
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
                    {seguro.linkedTutor?.nativeLanguage
                      ? ` · Habla ${seguro.linkedTutor.nativeLanguage}`
                      : ''}
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

          {/* Invitación a hacerse mentor/a (estudiantes locales) */}
          <HazteMentor nombre={dbUser?.fullName ?? ''} idioma={dbUser?.nativeLanguage ?? ''} />
        </div>
      )}
    </div>
  );
}
