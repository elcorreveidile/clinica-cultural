import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function LaboratorioCinePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const fases = [
    ['Guionización', 'Escribes el guion de la mini serie en equipo, con estudiantes locales e internacionales.'],
    ['Rodaje', 'Grabación de escenas en localizaciones de Granada. Dirección, cámara y actuación.'],
    ['Postproducción', 'Edición, subtitulado y revisión lingüística del material.'],
    ['Estreno', 'Presentación oficial de la mini serie web en el evento de clausura.'],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🎬 Laboratorio de cine
        </h1>
        <p className="text-clinic-blue/60">
          El proyecto estrella: producir una <strong>mini serie web</strong> aplicando el español en
          un contexto creativo y colaborativo.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {fases.map(([t, d], i) => (
          <div key={t} className="bg-white border border-clinic-gray rounded-2xl p-6">
            <div className="w-10 h-10 mb-3 rounded-full bg-clinic-gold text-white font-bold flex items-center justify-center">
              {i + 1}
            </div>
            <h2 className="font-bold text-clinic-blue">{t}</h2>
            <p className="text-sm text-clinic-blue/60 mt-1">{d}</p>
          </div>
        ))}
      </div>

      <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-clinic-blue">Tu mini serie aún no ha empezado</h3>
          <p className="text-clinic-blue/60 text-sm">
            La producción arranca en el Mes 1 del curso. Apúntate a las sesiones del Aula de Cine.
          </p>
        </div>
        <Link
          href="/dashboard/actividades"
          className="px-5 py-2.5 bg-clinic-gold text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-gold/90"
        >
          Ver sesiones de cine
        </Link>
      </div>
    </div>
  );
}
