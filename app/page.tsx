import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

const features = [
  {
    title: 'Diagnóstico Personalizado',
    color: 'text-clinic-red',
    body: 'Test de nivel + entrevista clínica para construir tu plan de tratamiento lingüístico único.',
    icon: '/imgs/iconos/diagnostico_icon.png',
  },
  {
    title: 'Farmacias Lingüísticas',
    color: 'text-clinic-green',
    body: 'Píldoras gramaticales, pomadas literarias y jarabes culturales dosificados a tu nivel.',
    icon: '/imgs/iconos/farmacia_icon.png',
  },
  {
    title: 'Seguro LC + Tutoría',
    color: 'text-clinic-gold',
    body: 'Tu tarjeta digital te conecta con tutores locales y actividades culturales en Granada.',
    icon: '/imgs/iconos/seguro_icon.png',
  },
];

export default async function Home() {
  const user = await getSessionUser();

  return (
    <main className="min-h-screen bg-clinic-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-clinic-gray">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link href="/sobre-clinica" className="hidden sm:inline text-clinic-blue/70 hover:text-clinic-blue">
              Sobre la clínica
            </Link>
            <Link
              href={user ? '/dashboard' : '/login'}
              className="px-5 py-2 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 transition"
            >
              {user ? 'Mi Dashboard' : 'Empezar'}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — banners del Espacio V Centenario (UGR) con tratamiento cálido + titular */}
      <section className="relative isolate overflow-hidden min-h-[78vh] flex items-end animate-fade-in">
        {/* Foto base (ya viene con grado cálido horneado) */}
        <img
          src="/imgs/backgrounds/hero_banners.jpg"
          alt="Banners del Espacio V Centenario de la Universidad de Granada"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        {/* Toque cálido muy sutil */}
        <div className="absolute inset-0 -z-10 bg-clinic-gold/5 mix-blend-multiply" />
        {/* Degradado para legibilidad del titular (oscuro abajo-izquierda) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-clinic-blue/95 via-clinic-blue/45 to-transparent" />

        <div className="relative w-full max-w-6xl mx-auto px-6 py-16 md:py-24 text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-white/15 backdrop-blur text-clinic-gold font-semibold text-sm mb-6">
            Universidad de Granada · 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow">
            Clínica Cultural
            <span className="block text-2xl md:text-4xl font-bold text-clinic-gold/90 mt-1">
              y Lingüística de Español
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-xl mb-8">
            No es un curso. Es una experiencia integral que combina el español con
            inmersión cultural en Granada.{' '}
            <strong className="text-white">Tu idioma. Tu futuro.</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={user ? '/dashboard' : '/login'}
              className="inline-block px-8 py-4 bg-clinic-red text-white text-lg font-bold rounded-xl shadow-lg shadow-clinic-red/30 hover:bg-clinic-red/90 transition"
            >
              Empezar tu Diagnóstico
            </Link>
            <Link
              href="/sobre-clinica"
              className="inline-block px-8 py-4 border border-white/40 text-white text-lg font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </section>

      {/* Features con iconos propios */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-clinic-gray p-8 rounded-2xl hover:shadow-lg transition text-center"
            >
              <img src={f.icon} alt="" className="w-20 h-20 mx-auto mb-4 object-contain" />
              <h3 className={`text-2xl font-bold mb-3 ${f.color}`}>{f.title}</h3>
              <p className="text-clinic-blue/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona — sobre textura de empedrado granadino */}
      <section className="relative isolate overflow-hidden py-20">
        <img
          src="/imgs/secciones/empedrado.jpg"
          alt="Empedrado granadino del patio del Centro de Lenguas Modernas"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        {/* velo cálido para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-clinic-white/80" />
        <div className="relative max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-12 text-center">
            Tu paso por la clínica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Entras a consulta', d: 'Llegas con tus dudas y objetivos con el español.' },
              { n: '2', t: 'Te diagnosticamos', d: 'Evaluamos tu nivel y diseñamos un plan a tu medida.' },
              { n: '3', t: 'Aplicamos el tratamiento', d: 'Recursos, tutoría e inmersión cultural real.' },
            ].map((s) => (
              <div
                key={s.n}
                className="bg-white/85 backdrop-blur border border-clinic-gray rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-clinic-red text-white text-2xl font-bold flex items-center justify-center">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-clinic-blue mb-2">{s.t}</h3>
                <p className="text-clinic-blue/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inmersión cultural — foto real de la Alhambra (Puerta de la Justicia) */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src="/imgs/backgrounds/puerta_dia.jpg"
            alt="Puerta de la Justicia de la Alhambra, Granada"
            className="w-full h-auto object-cover [filter:saturate(1.12)_contrast(1.05)]"
          />
          {/* capa cálida de marca */}
          <div className="absolute inset-0 bg-clinic-gold/15 mix-blend-multiply" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-4">
            Aprende español viviendo Granada
          </h2>
          <p className="text-lg text-clinic-blue/70 mb-6">
            Tutores locales, actividades culturales y una comunidad que te acompaña.
            Habla, aprende y conecta con la ciudad mientras avanzas de A1 a C2.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-clinic-green text-white text-lg font-bold rounded-xl hover:bg-clinic-green/90 transition"
          >
            Recibir mi Enlace Mágico
          </Link>
        </div>
      </section>

      {/* Banda CTA — Alhambra de noche a sangre */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/imgs/backgrounds/alhambra_noche.jpg"
          alt="La Alhambra de Granada iluminada de noche bajo la luna"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        {/* velo cálido para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-clinic-blue/55" />
        <div className="relative max-w-3xl mx-auto px-6 py-28 md:py-36 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow">
            Tu plaza en la Clínica te espera
          </h2>
          <p className="text-lg md:text-xl text-white/85 mb-8">
            Sin contraseñas. Recibe tu enlace mágico, hazte el diagnóstico y empieza a
            vivir el español en Granada.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-clinic-red text-white text-lg font-bold rounded-xl shadow-lg shadow-clinic-red/30 hover:bg-clinic-red/90 transition"
          >
            Recibir mi Enlace Mágico
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
