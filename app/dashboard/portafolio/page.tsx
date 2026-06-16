import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const TIPO_LABEL: Record<string, { label: string; icon: string }> = {
  writing: { label: 'Escritura', icon: '✍️' },
  audio: { label: 'Audio', icon: '🎧' },
  video: { label: 'Vídeo', icon: '🎬' },
  miniseries_episode: { label: 'Mini serie', icon: '📺' },
  project: { label: 'Proyecto', icon: '📦' },
};

export default async function PortafolioPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const items = await prisma.portafolio.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          📂 Mi portafolio
        </h1>
        <p className="text-clinic-blue/60">
          Tu repositorio de trabajos: textos, audios, vídeos y proyectos del curso, con feedback del
          profesorado.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-2">Tu portafolio está vacío</h2>
          <p className="text-clinic-blue/60 max-w-md mx-auto">
            A medida que avances en el curso, aquí se irán guardando tus trabajos (poemas, guiones,
            episodios de la mini serie…) y las correcciones de tus profesores.
          </p>
          <span className="inline-block mt-5 text-xs px-3 py-1 rounded-full bg-clinic-gray/60 text-clinic-blue/60">
            Subida de archivos · próximamente
          </span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => {
            const t = TIPO_LABEL[it.contentType] ?? { label: it.contentType, icon: '📄' };
            return (
              <div key={it.id} className="bg-white border border-clinic-gray rounded-2xl p-6">
                <div className="text-3xl mb-2">{t.icon}</div>
                <h2 className="font-bold text-clinic-blue">{it.title}</h2>
                <p className="text-xs text-clinic-gold font-semibold uppercase">{t.label}</p>
                {it.description && (
                  <p className="text-sm text-clinic-blue/60 mt-2">{it.description}</p>
                )}
                {it.professorFeedback && (
                  <p className="mt-3 text-sm text-clinic-blue/70 bg-clinic-green/5 border border-clinic-green/20 rounded-lg p-3">
                    <strong>Feedback:</strong> {it.professorFeedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
