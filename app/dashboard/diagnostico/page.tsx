import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DiagnosticoTest from '@/components/Forms/DiagnosticoTest';

export default async function DiagnosticoPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const diagnosis = await prisma.diagnosis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🩺 Diagnóstico Lingüístico
        </h1>
        <p className="text-clinic-blue/60">
          Un test rápido para situar tu nivel de español (MCER) y diseñar tu tratamiento.
        </p>
      </div>

      {diagnosis && user.currentLevel ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8">
          <p className="text-clinic-blue/60">Tu nivel diagnosticado es</p>
          <div className="text-6xl font-bold text-clinic-red my-3">
            {user.currentLevel}
          </div>
          <p className="text-clinic-blue/70">
            Puntuación: <strong>{diagnosis.grammarScore}%</strong> de aciertos.
          </p>
          {diagnosis.initialTreatmentPlan && (
            <p className="mt-4 p-4 bg-clinic-green/5 border border-clinic-green/20 rounded-xl text-clinic-blue/80">
              {diagnosis.initialTreatmentPlan}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/farmacias"
              className="px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold hover:bg-clinic-green/90"
            >
              Ver mis farmacias
            </Link>
            <Link
              href="/dashboard/emergencia"
              className="px-5 py-2.5 border border-clinic-gray rounded-lg font-semibold text-clinic-blue hover:bg-clinic-gray/40"
            >
              Consultar a El Doctor
            </Link>
          </div>
        </div>
      ) : (
        <DiagnosticoTest />
      )}
    </div>
  );
}
