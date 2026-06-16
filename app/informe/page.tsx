import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName, limpiarAnalisis } from '@/lib/utils';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Informe de diagnóstico lingüístico · Clínica Cultural' };

function interpreta(v: number | null): string {
  if (v == null) return 'Pendiente';
  if (v >= 75) return 'Alto';
  if (v >= 45) return 'Medio';
  return 'En desarrollo';
}

export default async function InformePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const diagnosis = await prisma.diagnosis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (!diagnosis) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-clinic-white px-4 text-center">
        <div>
          <p className="text-clinic-blue/70 mb-4">Aún no tienes un diagnóstico.</p>
          <Link href="/dashboard/diagnostico" className="text-clinic-red font-semibold underline">
            Hacer el diagnóstico
          </Link>
        </div>
      </main>
    );
  }

  const parametros = [
    { destreza: 'Gramática y uso', valor: diagnosis.grammarScore },
    { destreza: 'Comprensión auditiva', valor: diagnosis.listeningComprehensionScore },
    { destreza: 'Comprensión lectora', valor: diagnosis.readingComprehensionScore },
    { destreza: 'Expresión escrita (IA)', valor: diagnosis.writtenExpressionScore },
  ];

  const fecha = new Date(diagnosis.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-clinic-gray/20 print:bg-white py-8 px-4">
      {/* Barra de acciones (no se imprime) */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center print:hidden">
        <Link href="/dashboard/diagnostico" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
          ← Volver
        </Link>
        <DownloadPdfButton
          targetId="informe-hoja"
          filename={`informe-diagnostico-${diagnosis.assessedLevel ?? 'LC'}.pdf`}
        />
      </div>

      {/* Hoja del informe */}
      <article
        id="informe-hoja"
        className="max-w-3xl mx-auto bg-white border border-clinic-gray rounded-xl print:border-0 print:rounded-none shadow-sm print:shadow-none p-8 md:p-10"
      >
        {/* Cabecera tipo analítica clínica */}
        <header className="flex items-start justify-between border-b-2 border-clinic-red pb-4 mb-6">
          <div className="flex items-center gap-3">
            <img src="/imgs/logos/logo.png" alt="Clínica Cultural" className="h-12 w-12 object-contain" />
            <div>
              <p className="font-heading font-bold text-clinic-red leading-tight">
                Clínica Cultural y Lingüística
              </p>
              <p className="text-xs text-clinic-blue/60">de Español · Universidad de Granada</p>
            </div>
          </div>
          <div className="text-right text-xs text-clinic-blue/60">
            <p className="font-semibold text-clinic-blue">INFORME DE DIAGNÓSTICO</p>
            <p>Nº {diagnosis.id.slice(0, 8).toUpperCase()}</p>
            <p>{fecha}</p>
          </div>
        </header>

        {/* Datos del paciente */}
        <section className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-6">
          <p><span className="text-clinic-blue/50">Paciente:</span> <strong>{displayName(user)}</strong></p>
          <p><span className="text-clinic-blue/50">Email:</span> {user.email}</p>
          <p><span className="text-clinic-blue/50">Tipo de prueba:</span> Diagnóstico lingüístico (MCER)</p>
          <p>
            <span className="text-clinic-blue/50">Nivel orientativo:</span>{' '}
            <strong className="text-clinic-red text-base">{diagnosis.assessedLevel ?? '—'}</strong>
          </p>
        </section>

        {/* Tabla de parámetros */}
        <h2 className="text-sm font-bold text-clinic-blue uppercase tracking-wide mb-2">
          Parámetros analizados
        </h2>
        <table className="w-full text-sm border-collapse mb-8">
          <thead>
            <tr className="bg-clinic-gray/40 text-left text-clinic-blue/70">
              <th className="border border-clinic-gray px-3 py-2 font-semibold">Destreza</th>
              <th className="border border-clinic-gray px-3 py-2 font-semibold">Resultado</th>
              <th className="border border-clinic-gray px-3 py-2 font-semibold">Interpretación</th>
            </tr>
          </thead>
          <tbody>
            {parametros.map((p) => (
              <tr key={p.destreza}>
                <td className="border border-clinic-gray px-3 py-2">{p.destreza}</td>
                <td className="border border-clinic-gray px-3 py-2 font-semibold">
                  {p.valor != null ? `${p.valor}%` : '—'}
                </td>
                <td className="border border-clinic-gray px-3 py-2 text-clinic-blue/70">
                  {interpreta(p.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Análisis del facultativo (IA) */}
        <h2 className="text-sm font-bold text-clinic-blue uppercase tracking-wide mb-2">
          Observaciones de El Doctor
        </h2>
        <div className="text-sm text-clinic-blue/85 mb-8">
          {diagnosis.initialTreatmentPlan ? (
            <ChatMarkdown content={limpiarAnalisis(diagnosis.initialTreatmentPlan)} />
          ) : (
            <p>Sin observaciones.</p>
          )}
        </div>

        {/* Pie */}
        <footer className="border-t border-clinic-gray pt-4 text-xs text-clinic-blue/50">
          <p>
            Informe orientativo generado por la Clínica Cultural y Lingüística de Español. El nivel
            oral y la expresión escrita se validan en una sesión presencial con un docente.
          </p>
          <p className="mt-1">Clínica Cultural y Lingüística · Universidad de Granada · 2026</p>
        </footer>
      </article>
    </main>
  );
}
