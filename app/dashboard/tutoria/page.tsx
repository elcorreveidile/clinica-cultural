import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ESTADO: Record<string, { label: string; clase: string }> = {
  scheduled: { label: 'Programada', clase: 'bg-clinic-gold/15 text-clinic-gold' },
  completed: { label: 'Realizada', clase: 'bg-clinic-green/15 text-clinic-green' },
  cancelled: { label: 'Cancelada', clase: 'bg-clinic-red/15 text-clinic-red' },
};

export default async function TutoriaPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const sesiones = await prisma.sesionTutoria.findMany({
    where: { patientId: user.id },
    orderBy: { scheduledDate: 'desc' },
    include: { tutor: true },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          👥 Tutoría
        </h1>
        <p className="text-clinic-blue/60">
          Sesiones de acompañamiento con tu tutor local para resolver dudas y practicar.
        </p>
      </div>

      {sesiones.length === 0 ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-2">Aún no tienes sesiones</h2>
          <p className="text-clinic-blue/60 max-w-md mx-auto mb-5">
            Tu Seguro LC incluye sesiones de tutoría. Actívalo y te emparejaremos con un tutor local
            a través del servicio de <strong>Enfermería LC</strong>.
          </p>
          <Link
            href="/dashboard/seguro-lc"
            className="inline-block px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90"
          >
            Ver mi Seguro LC
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sesiones.map((s) => {
            const est = ESTADO[s.status ?? 'scheduled'] ?? ESTADO.scheduled;
            return (
              <div
                key={s.id}
                className="bg-white border border-clinic-gray rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-clinic-blue">
                    {s.tutor?.fullName ?? s.tutor?.email ?? 'Tutor por asignar'}
                  </p>
                  <p className="text-sm text-clinic-blue/50">
                    {s.scheduledDate
                      ? new Date(s.scheduledDate).toLocaleString('es-ES')
                      : 'Fecha por concretar'}{' '}
                    · {s.durationMinutes} min
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${est.clase}`}>
                  {est.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
