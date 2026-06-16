import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

export default function SobreClinicaPage() {
  const features: [string, string][] = [
    ['🩺 Diagnóstico', 'Evaluamos tu español con un test y una entrevista clínica.'],
    ['💊 Farmacias', 'Recursos dosificados: píldoras de gramática, jarabes culturales…'],
    ['🪪 Seguro LC', 'Tu tarjeta de paciente con tutoría y descuentos.'],
    ['🚨 Emergencia IA', 'Un tutor de IA disponible 24/7 para tus dudas.'],
  ];

  return (
    <main className="min-h-screen bg-clinic-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-clinic-gray bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link href="/programa" className="hidden sm:inline text-clinic-blue/70 hover:text-clinic-blue">
              Programa
            </Link>
            <Link href="/" className="hidden sm:inline text-clinic-blue/70 hover:text-clinic-blue">
              Inicio
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 transition"
            >
              Empezar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero band — foto del patio del CLM */}
      <section className="relative isolate overflow-hidden min-h-[42vh] flex items-end">
        <img
          src="/imgs/backgrounds/hero_clm.jpg"
          alt="Patio del Centro de Lenguas Modernas de la Universidad de Granada"
          className="absolute inset-0 -z-20 w-full h-full object-cover [filter:saturate(1.15)_contrast(1.04)]"
        />
        <div className="absolute inset-0 -z-10 bg-clinic-gold/15 mix-blend-multiply" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-clinic-blue/95 via-clinic-blue/45 to-transparent" />
        <div className="relative w-full max-w-6xl mx-auto px-6 py-12 md:py-16 text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-white/15 backdrop-blur text-clinic-gold font-semibold text-sm mb-4">
            Universidad de Granada · 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow">Sobre la Clínica</h1>
          <p className="text-lg text-white/85 max-w-xl mt-3">
            Aprender español como quien cuida su salud: con diagnóstico, tratamiento y
            seguimiento personalizado en Granada.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <article className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <p className="text-lg text-clinic-blue/70">
          La <strong className="text-clinic-blue">Clínica Cultural y Lingüística de Español</strong>{' '}
          reinventa el aprendizaje del idioma con la metáfora de un centro de salud:
          diagnosticamos tu nivel, te recetamos recursos a medida y te acompañamos con
          tutoría e inmersión cultural en Granada.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {features.map(([t, d]) => (
            <div key={t} className="bg-white border border-clinic-gray rounded-xl p-5">
              <h3 className="font-bold text-clinic-blue">{t}</h3>
              <p className="text-clinic-blue/60 text-sm mt-1">{d}</p>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-clinic-green text-white font-bold rounded-xl hover:bg-clinic-green/90 transition"
          >
            Empezar mi diagnóstico
          </Link>
        </div>
      </article>

      {/* Footer */}
      <Footer />
    </main>
  );
}
