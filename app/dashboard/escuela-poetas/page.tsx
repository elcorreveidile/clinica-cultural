import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { RETOS } from '@/lib/poesia';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';
import TallerEscritura from '@/components/Poetas/TallerEscritura';

export const dynamic = 'force-dynamic';

const TALLERES = [
  ['🗣️ Pronunciación y prosodia', 'Trabaja el ritmo, la entonación y la musicalidad del español.'],
  ['✍️ Escritura creativa', 'Desarrolla tu expresión escrita: del verso al guion de la mini serie.'],
  ['📖 Lectura en público', 'Pierde el miedo a leer y recitar ante un público.'],
  ['💊 Farmacia poética', 'Recetas literarias para “tratar” bloqueos y ganar fluidez escrita.'],
];

export default async function EscuelaPoetasPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          ✍️ Escuela de Poetas
        </h1>
        <p className="text-clinic-blue/60">
          El taller de escritura y voz de la Clínica: aprende español creando, recitando y
          escribiendo. Elige un reto, escribe y deja que La Doctora te dé su feedback.
        </p>
      </div>

      {/* En qué consiste */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TALLERES.map(([t, d]) => (
          <div key={t} className="bg-white border border-clinic-gray rounded-2xl p-5">
            <h2 className="font-bold text-clinic-blue text-sm">{t}</h2>
            <p className="text-sm text-clinic-blue/60 mt-1">{d}</p>
          </div>
        ))}
      </div>

      {/* Retos de escritura */}
      <div>
        <h2 className="text-xl font-bold text-clinic-blue mb-3">Retos de escritura</h2>
        <div className="space-y-3">
          {RETOS.map((r) => (
            <details key={r.id} className="group bg-white border border-clinic-gray rounded-2xl overflow-hidden">
              <summary className="flex items-center gap-3 p-5 cursor-pointer list-none">
                <span className="text-2xl">{r.icono}</span>
                <span className="flex-1">
                  <span className="block font-bold text-clinic-blue">{r.titulo}</span>
                  <span className="text-xs text-clinic-blue/50">
                    {r.forma} · Nivel {r.nivel}
                  </span>
                </span>
                <span className="text-clinic-blue/40 group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="px-5 pb-5 -mt-1 border-t border-clinic-gray/60 pt-4 space-y-4">
                <p className="text-sm text-clinic-blue/60">{r.descripcion}</p>
                <div>
                  <ChatMarkdown content={r.instrucciones} />
                </div>
                <div className="bg-clinic-gold/5 border border-clinic-gold/20 rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-clinic-gold mb-2">
                    Ejemplo
                  </p>
                  <ChatMarkdown content={r.ejemplo} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Taller de escritura con feedback IA + guardar en portafolio */}
      <TallerEscritura retos={RETOS.map((r) => ({ id: r.id, titulo: r.titulo }))} />
    </div>
  );
}
