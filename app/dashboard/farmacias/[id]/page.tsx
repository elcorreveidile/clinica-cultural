import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recursosDe, DOSIS, FORMATO_LABEL } from '@/lib/recursos';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';
import RecursoPdfButton from '@/components/RecursoPdfButton';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  grammar: 'Gramática',
  vocabulary: 'Vocabulario',
  cultural: 'Cultura',
  conversation: 'Conversación',
  writing: 'Escritura',
  audiovisual: 'Audiovisual',
};

export default async function FarmaciaDetallePage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const farmacia = await prisma.farmacia.findUnique({ where: { id: params.id } });
  if (!farmacia) notFound();

  const recursos = recursosDe(farmacia.category);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/dashboard/farmacias" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
        ← Volver a las farmacias
      </Link>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          💊 {farmacia.name}
        </h1>
        <p className="text-clinic-blue/60">{farmacia.description}</p>
        <div className="flex gap-2 mt-2 text-xs">
          {farmacia.category && (
            <span className="px-2 py-1 rounded-full bg-clinic-gold/15 text-clinic-gold font-semibold uppercase">
              {CATEGORY_LABELS[farmacia.category] ?? farmacia.category}
            </span>
          )}
          {farmacia.targetLevel && (
            <span className="px-2 py-1 rounded-full bg-clinic-green/10 text-clinic-green font-semibold">
              Nivel {farmacia.targetLevel}
            </span>
          )}
        </div>
      </div>

      {recursos.length === 0 ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center text-clinic-blue/60">
          Estamos preparando los recursos de esta farmacia. ¡Vuelve pronto!
        </div>
      ) : (
        <div className="space-y-3">
          {recursos.map((r) => {
            const dosis = DOSIS[r.tipo];
            return (
              <details
                key={r.id}
                className="group bg-white border border-clinic-gray rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center gap-3 p-5 cursor-pointer list-none">
                  <span className="text-2xl">{dosis.icon}</span>
                  <span className="flex-1">
                    <span className="block font-bold text-clinic-blue">{r.titulo}</span>
                    <span className="text-xs text-clinic-blue/50">
                      {dosis.label} · {FORMATO_LABEL[r.formato]} · Nivel {r.nivel} · {r.duracionMin} min
                    </span>
                  </span>
                  <span className="text-clinic-blue/40 group-open:rotate-180 transition">▾</span>
                </summary>
                <div className="px-5 pb-5 -mt-1 border-t border-clinic-gray/60 pt-4">
                  <p className="text-sm text-clinic-blue/60 mb-3">{r.descripcion}</p>
                  <ChatMarkdown content={r.contenido} />
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-clinic-red font-semibold underline text-sm"
                    >
                      Abrir recurso externo ↗
                    </a>
                  )}
                  <RecursoPdfButton
                    farmaciaNombre={farmacia.name}
                    recurso={{
                      id: r.id,
                      titulo: r.titulo,
                      dosisLabel: dosis.label,
                      formatoLabel: FORMATO_LABEL[r.formato],
                      nivel: r.nivel,
                      duracionMin: r.duracionMin,
                      descripcion: r.descripcion,
                      contenido: r.contenido,
                    }}
                  />
                </div>
              </details>
            );
          })}
        </div>
      )}

      <div className="bg-clinic-red/5 border border-clinic-red/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-clinic-blue/70 text-sm">
          ¿Te ha surgido una duda con algún recurso? Pregúntale a La Doctora.
        </p>
        <Link
          href="/dashboard/emergencia"
          className="px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-red/90"
        >
          🚨 Consultar a La Doctora
        </Link>
      </div>
    </div>
  );
}
