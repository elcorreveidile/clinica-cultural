import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function EscuelaPoetasPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const talleres = [
    ['🗣️ Pronunciación y prosodia', 'Trabaja el ritmo, la entonación y la musicalidad del español.'],
    ['✍️ Escritura creativa', 'Desarrolla tu expresión escrita: del verso al guion de la mini serie.'],
    ['📖 Lectura en público', 'Pierde el miedo a leer y recitar ante un público.'],
    ['💊 Farmacia poética', 'Recetas literarias para “tratar” bloqueos y ganar fluidez escrita.'],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          ✍️ Escuela de Poetas
        </h1>
        <p className="text-clinic-blue/60">
          El taller de escritura y voz de la Clínica: aprende español creando, recitando y
          escribiendo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {talleres.map(([t, d]) => (
          <div key={t} className="bg-white border border-clinic-gray rounded-2xl p-6">
            <h2 className="font-bold text-clinic-blue">{t}</h2>
            <p className="text-sm text-clinic-blue/60 mt-1">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-clinic-gray rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-clinic-blue/70">
          Los talleres de la Escuela de Poetas forman parte de la agenda semanal del curso.
        </p>
        <Link
          href="/dashboard/actividades"
          className="px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-green/90"
        >
          Ver talleres en la agenda
        </Link>
      </div>
    </div>
  );
}
