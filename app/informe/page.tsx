import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName, limpiarAnalisis } from '@/lib/utils';
import InformeHoja from '@/components/InformeHoja';
import DownloadPdfButton from '@/components/DownloadPdfButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Informe de diagnóstico lingüístico · Clínica Cultural' };

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

  const data = {
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
  };

  return (
    <main className="min-h-screen bg-clinic-gray/20 print:bg-white py-8 px-4">
      <div className="max-w-3xl mx-auto mb-4 flex justify-between items-center print:hidden">
        <Link href="/dashboard/diagnostico" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
          ← Volver
        </Link>
        <DownloadPdfButton targetId="informe-hoja" filename={`informe-diagnostico-${data.nivel}.pdf`} />
      </div>

      <InformeHoja id="informe-hoja" data={data} />
    </main>
  );
}
