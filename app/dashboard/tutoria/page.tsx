import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';
import { puedeTutoriaProfesor, cupoTutoriasEfectivo } from '@/lib/planes';
import ReservarSesion from '@/components/Tutoria/ReservarSesion';
import SesionAcciones from '@/components/Tutoria/SesionAcciones';
import AceptarSolicitudButton from '@/components/Tutoria/AceptarSolicitudButton';

export const dynamic = 'force-dynamic';

const ROLES_TUTOR = ['professor', 'tutor_local', 'admin'];
const ROLES_PROFESOR = ['professor', 'admin'];

const ESTADO: Record<string, { label: string; clase: string }> = {
  scheduled: { label: 'Programada', clase: 'bg-clinic-gold/15 text-clinic-gold' },
  completed: { label: 'Realizada', clase: 'bg-clinic-green/15 text-clinic-green' },
  cancelled: { label: 'Cancelada', clase: 'bg-clinic-red/15 text-clinic-red' },
};

function fmtFecha(d: Date | null) {
  return d
    ? new Date(d).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Fecha por concretar';
}

function ViaBadge({ esProfesor }: { esProfesor: boolean }) {
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
        esProfesor ? 'bg-clinic-blue/10 text-clinic-blue' : 'bg-clinic-green/10 text-clinic-green'
      }`}
    >
      {esProfesor ? '👩‍🏫 Tutoría' : '🤝 Mentoría'}
    </span>
  );
}

export default async function TutoriaPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const esTutor = ROLES_TUTOR.includes(user.role);
  const esProfesor = ROLES_PROFESOR.includes(user.role);

  // ───────────────── Vista de tutor / profesor ─────────────────
  if (esTutor) {
    const [mias, solicitudes] = await Promise.all([
      prisma.sesionTutoria.findMany({
        where: { tutorId: user.id },
        orderBy: { scheduledDate: 'desc' },
        include: { patient: true },
      }),
      esProfesor
        ? prisma.sesionTutoria.findMany({
            where: { tutorId: null, status: 'scheduled' },
            orderBy: { scheduledDate: 'asc' },
            include: { patient: true },
          })
        : Promise.resolve([]),
    ]);

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
            👥 Tutoría y mentoría
          </h1>
          <p className="text-clinic-blue/60">
            Gestiona las sesiones que te reservan. {esProfesor && 'Acepta solicitudes de tutoría de alumnos matriculados.'}
          </p>
        </div>

        {/* Solicitudes de tutoría sin asignar */}
        {esProfesor && (
          <div className="bg-white border border-clinic-gray rounded-2xl p-6">
            <h2 className="font-bold text-clinic-blue mb-4">Solicitudes de tutoría</h2>
            {solicitudes.length === 0 ? (
              <p className="text-clinic-blue/50 text-sm">No hay solicitudes sin asignar ahora mismo.</p>
            ) : (
              <ul className="space-y-3">
                {solicitudes.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 border border-clinic-gray rounded-xl p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-clinic-blue truncate">
                        {s.patient ? displayName(s.patient) : 'Paciente'}
                      </p>
                      <p className="text-xs text-clinic-blue/50">{fmtFecha(s.scheduledDate)}</p>
                      {s.notes && <p className="text-sm text-clinic-blue/60 mt-1">{s.notes}</p>}
                    </div>
                    <AceptarSolicitudButton id={s.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sesiones propias */}
        <div className="bg-white border border-clinic-gray rounded-2xl p-6">
          <h2 className="font-bold text-clinic-blue mb-4">Tus sesiones</h2>
          {mias.length === 0 ? (
            <p className="text-clinic-blue/50 text-sm">
              Aún no tienes sesiones. Acepta una pareja en{' '}
              <Link href="/dashboard/enfermeria-lc" className="text-clinic-red underline">
                Enfermería LC
              </Link>{' '}
              o una solicitud de tutoría.
            </p>
          ) : (
            <div className="space-y-3">
              {mias.map((s) => {
                const est = ESTADO[s.status ?? 'scheduled'] ?? ESTADO.scheduled;
                return (
                  <div key={s.id} className="border border-clinic-gray rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-clinic-blue truncate">
                            {s.patient ? displayName(s.patient) : 'Paciente'}
                          </p>
                          <ViaBadge esProfesor={!s.seguroLcId} />
                        </div>
                        <p className="text-sm text-clinic-blue/50">
                          {fmtFecha(s.scheduledDate)} · {s.durationMinutes} min
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${est.clase}`}>
                          {est.label}
                        </span>
                        {s.status === 'scheduled' && <SesionAcciones id={s.id} rol="tutor" />}
                      </div>
                    </div>
                    {s.notes && (
                      <p className="text-sm text-clinic-blue/60 mt-3 bg-clinic-gray/30 rounded-lg p-3">
                        <strong>Tema:</strong> {s.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ───────────────── Vista de paciente ─────────────────
  const seguro = await prisma.seguroLC.findUnique({
    where: { userId: user.id },
    include: { linkedTutor: true },
  });

  const sesiones = await prisma.sesionTutoria.findMany({
    where: { patientId: user.id },
    orderBy: { scheduledDate: 'desc' },
    include: { tutor: true },
  });

  const tieneTutor = Boolean(seguro?.linkedTutorId);
  const programadasMentor = sesiones.filter((s) => s.status === 'scheduled' && s.seguroLcId).length;
  const disponibles = seguro
    ? seguro.mentoringSessionsTotal - seguro.mentoringSessionsUsed - programadasMentor
    : 0;
  const tutorNombre = seguro?.linkedTutor ? displayName(seguro.linkedTutor) : 'tu mentor/a';
  const puedeTutoria = puedeTutoriaProfesor(user);
  // Cupo de tutorías con profesorado incluido en el paquete (según el plan).
  const cupoProfesor = cupoTutoriasEfectivo(user);
  const usadasProfesor = sesiones.filter((s) => !s.seguroLcId && s.status !== 'cancelled').length;
  const disponiblesProfesor = cupoProfesor - usadasProfesor;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          👥 Tutoría y mentoría
        </h1>
        <p className="text-clinic-blue/60">
          Refuerza tu español con sesiones de acompañamiento. La <strong>mentoría</strong> es con{' '}
          <strong>gente local</strong> —de la UGR u otras personas de Granada— (incluida en tu Seguro
          LC). La <strong>tutoría</strong> es con <strong>profesorado</strong> (incluida en los
          paquetes de alumno matriculado).
        </p>
      </div>

      {/* Mentoría con gente local */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-clinic-blue">🤝 Mentoría (gente local)</h2>
          <ViaBadge esProfesor={false} />
        </div>
        {tieneTutor ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-clinic-blue">{tutorNombre}</p>
              <p className="text-sm text-clinic-blue/50">
                {disponibles} {disponibles === 1 ? 'sesión disponible' : 'sesiones disponibles'} ·{' '}
                {seguro!.mentoringSessionsUsed}/{seguro!.mentoringSessionsTotal} usadas
              </p>
            </div>
            <ReservarSesion tipo="mentor" disponibles={disponibles} tutorNombre={tutorNombre} />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-clinic-blue/60 text-sm">
              Las sesiones de mentoría están incluidas en tu Seguro LC. Actívalo y solicita tu
              mentor/a local en Enfermería LC.
            </p>
            <Link
              href="/dashboard/enfermeria-lc"
              className="px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-green/90"
            >
              Ir a Enfermería LC
            </Link>
          </div>
        )}
      </div>

      {/* Tutoría con profesorado (paquetes) */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-clinic-blue">👩‍🏫 Tutoría (con profesor)</h2>
          <ViaBadge esProfesor={true} />
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-clinic-gold/15 text-clinic-gold">
            Alumnos matriculados
          </span>
        </div>
        {puedeTutoria ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-clinic-blue/50">
              {Math.max(0, disponiblesProfesor)} de {cupoProfesor} tutorías con profesorado
              disponibles en tu paquete.
            </p>
            <ReservarSesion
              tipo="professor"
              tutorNombre="un profesor"
              disponibles={disponiblesProfesor}
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-clinic-blue/60 text-sm">
              La tutoría con profesorado titulado está <strong>incluida en los paquetes</strong> de
              alumno matriculado: <strong>2 tutorías</strong> (mensual) u <strong>8</strong>{' '}
              (trimestral). Matricúlate para reservarla.
            </p>
            <a
              href="/programa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-clinic-gold text-clinic-gold rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-gold/10"
            >
              Ver planes ↗
            </a>
          </div>
        )}
      </div>

      {/* Listado de sesiones del paciente */}
      <div>
        <h2 className="font-bold text-clinic-blue mb-3">Tus sesiones</h2>
        {sesiones.length === 0 ? (
          <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center text-clinic-blue/60">
            Aún no has reservado ninguna sesión.
          </div>
        ) : (
          <div className="space-y-3">
            {sesiones.map((s) => {
              const est = ESTADO[s.status ?? 'scheduled'] ?? ESTADO.scheduled;
              const sinAsignar = !s.tutorId;
              return (
                <div key={s.id} className="bg-white border border-clinic-gray rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-clinic-blue truncate">
                          {s.tutor
                            ? displayName(s.tutor)
                            : sinAsignar
                            ? 'Buscando profesor…'
                            : 'Tutor por asignar'}
                        </p>
                        <ViaBadge esProfesor={!s.seguroLcId} />
                      </div>
                      <p className="text-sm text-clinic-blue/50">
                        {fmtFecha(s.scheduledDate)} · {s.durationMinutes} min
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${est.clase}`}>
                        {est.label}
                      </span>
                      {s.status === 'scheduled' && <SesionAcciones id={s.id} rol="patient" />}
                    </div>
                  </div>
                  {s.notes && (
                    <p className="text-sm text-clinic-blue/60 mt-3 bg-clinic-gray/30 rounded-lg p-3">
                      <strong>Tema:</strong> {s.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
