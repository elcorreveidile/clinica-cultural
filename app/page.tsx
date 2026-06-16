import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

const features = [
  {
    title: 'Diagnóstico Personalizado',
    color: 'text-clinic-red',
    body: 'Test de nivel + entrevista clínica para construir tu plan de tratamiento lingüístico único.',
    icon: '🩺',
  },
  {
    title: 'Farmacias Lingüísticas',
    color: 'text-clinic-green',
    body: 'Píldoras gramaticales, pomadas literarias y jarabes culturales dosificados a tu nivel.',
    icon: '💊',
  },
  {
    title: 'Seguro LC + Tutoría',
    color: 'text-clinic-gold',
    body: 'Tu tarjeta digital te conecta con tutores locales y actividades culturales en Granada.',
    icon: '🪪',
  },
];

const stages = [
  { n: '1', title: 'Entras a consulta', body: 'Llegas con tus dudas y objetivos con el español.' },
  { n: '2', title: 'Te diagnosticamos', body: 'Evaluamos tu nivel y diseñamos un plan a tu medida.' },
  { n: '3', title: 'Aplicamos el tratamiento', body: 'Recursos, tutoría e inmersión cultural real.' },
];

export default async function Home() {
  const user = await getSessionUser();

  return (
    <main className="min-h-screen bg-clinic-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-clinic-white/90 backdrop-blur border-b border-clinic-gray">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-clinic-red font-heading">
              Clínica Cultural
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/sobre-clinica" className="hidden sm:inline text-clinic-blue/70 hover:text-clinic-blue">
              Sobre la clínica
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 transition"
              >
                Mi Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 transition"
              >
                Empezar
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-clinic-pattern">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center animate-fade-in">
          <span className="inline-block px-4 py-1 rounded-full bg-clinic-green/10 text-clinic-green font-semibold text-sm mb-6">
            Universidad de Granada · 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-clinic-blue leading-tight">
            ¿Qué es la Clínica Cultural y Lingüística?
          </h1>
          <p className="text-lg md:text-xl text-clinic-blue/70 max-w-2xl mx-auto mb-10">
            No es un curso. Es una experiencia integral que combina el aprendizaje
            del español con inmersión cultural, en un entorno clínico y personalizado.
          </p>
          <Link
            href={user ? '/dashboard' : '/login'}
            className="inline-block px-10 py-4 bg-clinic-red text-white text-lg font-bold rounded-xl shadow-lg shadow-clinic-red/20 hover:bg-clinic-red/90 transition"
          >
            Empezar tu Diagnóstico
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-clinic-gray p-8 rounded-2xl hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className={`text-2xl font-bold mb-3 ${f.color}`}>{f.title}</h3>
              <p className="text-clinic-blue/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-clinic-gray/40 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-clinic-blue mb-14">
            Tu paso por la clínica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stages.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-clinic-red text-white text-2xl font-bold flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-clinic-blue mb-2">{s.title}</h3>
                <p className="text-clinic-blue/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-6">
          Tu diagnóstico lingüístico te espera
        </h2>
        <p className="text-clinic-blue/70 mb-8">
          Sin contraseñas. Recibes un enlace mágico en tu correo y entras en segundos.
        </p>
        <Link
          href="/login"
          className="inline-block px-10 py-4 bg-clinic-green text-white text-lg font-bold rounded-xl hover:bg-clinic-green/90 transition"
        >
          Recibir mi Enlace Mágico
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-clinic-blue text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <p className="font-heading text-lg">Clínica Cultural y Lingüística de Español</p>
          <p className="text-white/60 text-sm">Universidad de Granada · 2026</p>
        </div>
      </footer>
    </main>
  );
}
