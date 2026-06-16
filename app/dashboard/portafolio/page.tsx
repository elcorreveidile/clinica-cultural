import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SubirTrabajo from '@/components/Portafolio/SubirTrabajo';
import EliminarTrabajoButton from '@/components/Portafolio/EliminarTrabajoButton';

export const dynamic = 'force-dynamic';

const TIPO_LABEL: Record<string, { label: string; icon: string }> = {
  writing: { label: 'Escritura', icon: '✍️' },
  audio: { label: 'Audio', icon: '🎧' },
  video: { label: 'Vídeo', icon: '🎬' },
  miniseries_episode: { label: 'Mini serie', icon: '📺' },
  project: { label: 'Proyecto', icon: '📦' },
};

function esImagen(url: string) {
  return /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(url);
}
function esAudio(url: string) {
  return /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(url);
}
function esVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

function MediaTrabajo({ url, contentType }: { url: string; contentType: string }) {
  if (esImagen(url)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="mt-3 rounded-lg w-full object-cover max-h-56" />;
  }
  if (esAudio(url) || contentType === 'audio') {
    return <audio controls src={url} className="mt-3 w-full" />;
  }
  if (esVideo(url) || contentType === 'video' || contentType === 'miniseries_episode') {
    return <video controls src={url} className="mt-3 rounded-lg w-full max-h-56" />;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-3 text-clinic-red font-semibold underline text-sm"
    >
      Abrir archivo ↗
    </a>
  );
}

export default async function PortafolioPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const items = await prisma.portafolio.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
            📂 Mi portafolio
          </h1>
          <p className="text-clinic-blue/60">
            Tu repositorio de trabajos: textos, audios, vídeos y proyectos del curso, con feedback del
            profesorado.
          </p>
        </div>
        <SubirTrabajo />
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-xl font-bold text-clinic-blue mb-2">Tu portafolio está vacío</h2>
          <p className="text-clinic-blue/60 max-w-md mx-auto">
            Sube tu primer trabajo (un poema, un guion, un episodio de la mini serie, un audio…) con el
            botón <strong>«Subir un trabajo»</strong>. Aquí se guardarán junto con las correcciones de
            tus profesores.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => {
            const t = TIPO_LABEL[it.contentType] ?? { label: it.contentType, icon: '📄' };
            return (
              <div key={it.id} className="bg-white border border-clinic-gray rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <EliminarTrabajoButton id={it.id} />
                </div>
                <h2 className="font-bold text-clinic-blue">{it.title}</h2>
                <p className="text-xs text-clinic-gold font-semibold uppercase">{t.label}</p>
                {it.description && (
                  <p className="text-sm text-clinic-blue/60 mt-2 whitespace-pre-wrap">{it.description}</p>
                )}
                {it.fileUrl && <MediaTrabajo url={it.fileUrl} contentType={it.contentType} />}
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
