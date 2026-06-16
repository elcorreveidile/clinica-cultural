import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { limpiarAnalisis, displayName } from '@/lib/utils';
import DiagnosticoTest from '@/components/Forms/DiagnosticoTest';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';
import DescargarInformeButton from '@/components/DescargarInformeButton';

export default async function DiagnosticoPage({
  searchParams,
}: {
  searchParams: { rehacer?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const diagnosis = await prisma.diagnosis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  const mostrarResultados =
    diagnosis && user.currentLevel && searchParams?.rehacer !== '1';

  const informeData = diagnosis
    ? {
        numero: diagnosis.id.slice(0, 8).toUpperCase(),
        fecha: new Date(diagnosis.createdAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        nombre: displayName(user),
        email: user.email,
        nivel: diagnosis.assessedLevel ?? user.currentLevel ?? '—',
        parametros: [
          { destreza: 'Gramática y uso', valor: diagnosis.grammarScore },
          { destreza: 'Comprensión auditiva', valor: diagnosis.listeningComprehensionScore },
          { destreza: 'Comprensión lectora', valor: diagnosis.readingComprehensionScore },
          { destreza: 'Expresión escrita (IA)', valor: diagnosis.writtenExpressionScore },
        ],
        analisis: limpiarAnalisis(diagnosis.initialTreatmentPlan),
      }
    : null;

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

      {mostrarResultados ? (
        <div className="space-y-4">
          <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8">
            <p className="text-clinic-blue/60">Tu nivel orientativo es</p>
            <div className="text-6xl font-bold text-clinic-red my-3">{user.currentLevel}</div>

            {/* Subnotas por sección */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Gramática', value: diagnosis.grammarScore },
                { label: 'Auditiva', value: diagnosis.listeningComprehensionScore },
                { label: 'Lectora', value: diagnosis.readingComprehensionScore },
                { label: 'Escrita (IA)', value: diagnosis.writtenExpressionScore },
              ].map((s) => (
                <div key={s.label} className="bg-clinic-gray/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-clinic-blue">
                    {s.value ?? '—'}
                    {s.value != null && '%'}
                  </div>
                  <div className="text-xs text-clinic-blue/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

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
                Consultar a La Doctora
              </Link>
              <Link
                href="/dashboard/diagnostico?rehacer=1"
                className="px-5 py-2.5 border border-clinic-gray rounded-lg font-semibold text-clinic-blue/70 hover:bg-clinic-gray/40"
              >
                🔁 Rehacer diagnóstico
              </Link>
            </div>
          </div>

          {/* Análisis lingüístico generado por la IA */}
          {diagnosis.initialTreatmentPlan && (
            <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-clinic-blue flex items-center gap-2">
                  🧪 Tu análisis lingüístico
                </h2>
                {informeData && (
                  <DescargarInformeButton
                    data={informeData}
                    filename={`informe-diagnostico-${informeData.nivel}.pdf`}
                  />
                )}
              </div>
              <div className="text-clinic-blue/85">
                <ChatMarkdown content={limpiarAnalisis(diagnosis.initialTreatmentPlan)} />
              </div>
            </div>
          )}

          {/* Siguiente paso: evaluación oral con docente */}
          <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-clinic-blue">🗣️ Falta tu evaluación oral</h3>
              <p className="text-clinic-blue/70 text-sm">
                Tu nivel oral y tu expresión escrita los valora un docente en una sesión personal.
                Resérvala a través de la tutoría.
              </p>
            </div>
            <Link
              href="/dashboard/tutoria"
              className="px-5 py-2.5 bg-clinic-gold text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-gold/90"
            >
              Ir a Tutoría
            </Link>
          </div>
        </div>
      ) : (
        <DiagnosticoTest />
      )}
    </div>
  );
}
