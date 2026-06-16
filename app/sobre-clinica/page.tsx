import Link from 'next/link';

export default function SobreClinicaPage() {
  return (
    <main className="min-h-screen bg-clinic-white">
      <header className="border-b border-clinic-gray bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-clinic-red font-heading">
            🏥 Clínica Cultural
          </Link>
          <Link href="/login" className="px-5 py-2 bg-clinic-red text-white rounded-lg font-semibold">
            Empezar
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16 prose-clinic space-y-6">
        <h1 className="text-4xl font-bold text-clinic-blue">Sobre la Clínica</h1>
        <p className="text-lg text-clinic-blue/70">
          La <strong>Clínica Cultural y Lingüística de Español</strong> reinventa el aprendizaje
          del idioma con la metáfora de un centro de salud: diagnosticamos tu nivel, te recetamos
          recursos a medida y te acompañamos con tutoría e inmersión cultural en Granada.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 not-prose">
          {[
            ['🩺 Diagnóstico', 'Evaluamos tu español con un test y una entrevista clínica.'],
            ['💊 Farmacias', 'Recursos dosificados: píldoras de gramática, jarabes culturales…'],
            ['🪪 Seguro LC', 'Tu tarjeta de paciente con tutoría y descuentos.'],
            ['🚨 Emergencia IA', 'Un tutor de IA disponible 24/7 para tus dudas.'],
          ].map(([t, d]) => (
            <div key={t} className="bg-white border border-clinic-gray rounded-xl p-5">
              <h3 className="font-bold text-clinic-blue">{t}</h3>
              <p className="text-clinic-blue/60 text-sm mt-1">{d}</p>
            </div>
          ))}
        </div>

        <div className="not-prose pt-4">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-clinic-green text-white font-bold rounded-xl hover:bg-clinic-green/90"
          >
            Empezar mi diagnóstico
          </Link>
        </div>
      </article>
    </main>
  );
}
