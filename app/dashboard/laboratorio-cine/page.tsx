import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { LAB, CAPITULOS, FASE_INFO, METODOLOGIA } from '@/lib/laboratorio';
import DriveArchivo from '@/components/Laboratorio/DriveArchivo';

export const dynamic = 'force-dynamic';

export default async function LaboratorioCinePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🎬 Laboratorio de cine
        </h1>
        <p className="text-clinic-blue/60">
          Escribimos, rodamos y montamos una <strong>mini serie web</strong> en español. Aquí está el
          proyecto colectivo de la clase: capítulos, metodología y todo el material de trabajo.
        </p>
      </div>

      {/* La serie */}
      <div className="bg-gradient-to-br from-clinic-blue to-clinic-red rounded-2xl p-6 text-white">
        <p className="text-xs uppercase tracking-widest text-white/70">Proyecto colectivo</p>
        <h2 className="font-heading text-2xl font-bold">{LAB.serie.titulo}</h2>
        <p className="text-white/85 mt-2 max-w-2xl">{LAB.serie.sinopsis}</p>
      </div>

      {/* Capítulos */}
      <div>
        <h2 className="text-xl font-bold text-clinic-blue mb-3">Capítulos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAPITULOS.map((c) => {
            const f = FASE_INFO[c.fase];
            return (
              <div key={c.numero} className="bg-white border border-clinic-gray rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-clinic-blue/40">CAP. {c.numero}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.clase}`}>
                    {f.icon} {f.label}
                  </span>
                </div>
                <h3 className="font-bold text-clinic-blue">{c.titulo}</h3>
                <p className="text-sm text-clinic-blue/60 mt-1 flex-1">{c.sinopsis}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cómo se trabaja */}
      <div>
        <h2 className="text-xl font-bold text-clinic-blue mb-3">Cómo se trabaja en el laboratorio</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METODOLOGIA.map((m) => (
            <div key={m.fase} className="bg-white border border-clinic-gray rounded-2xl p-5">
              <div className="text-2xl mb-1">{m.icon}</div>
              <h3 className="font-bold text-clinic-blue mb-2">{m.fase}</h3>
              <ul className="space-y-1">
                {m.pasos.map((p) => (
                  <li key={p} className="text-sm text-clinic-blue/60 flex gap-2">
                    <span className="text-clinic-green">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* El archivo del laboratorio (Drive) */}
      <div>
        <h2 className="text-xl font-bold text-clinic-blue mb-1">El archivo del laboratorio</h2>
        <p className="text-clinic-blue/60 text-sm mb-3">
          Guiones, fichas de personajes, fotografías y tomas: el material real de trabajo, directo
          desde Google Drive.
        </p>
        <DriveArchivo folderId={LAB.driveFolderId} />
      </div>

      {/* Conexión con el portafolio */}
      <div className="bg-clinic-green/5 border border-clinic-green/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-clinic-blue/70 text-sm">
          ¿Has grabado tu escena o tu episodio? Súbelo a tu portafolio como «Mini serie».
        </p>
        <Link
          href="/dashboard/portafolio"
          className="px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-green/90"
        >
          Ir a Mi portafolio
        </Link>
      </div>
    </div>
  );
}
