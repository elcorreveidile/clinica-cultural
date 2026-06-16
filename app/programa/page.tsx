import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import MatriculaButton from '@/components/MatriculaButton';
import { getSessionUser } from '@/lib/auth';
import type { PlanId } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Programa y precios · Clínica Cultural',
  description:
    'Curso inmersivo de 3 meses de español en Granada: estructura, fases y precios de la Clínica Cultural y Lingüística.',
};

const fases = [
  {
    n: 'Mes 1',
    titulo: 'Inmersión y preparación',
    items: [
      'Clínicas de conversación y talleres de escritura creativa',
      'Safaris fotográficos y rutas de tapas',
      'Arranque de la mini serie web (guion y grabación)',
    ],
    color: 'border-clinic-red',
  },
  {
    n: 'Mes 2',
    titulo: 'Producción y actividades culturales',
    items: [
      'Conversación en contextos profesionales y académicos',
      'Postproducción y edición de la mini serie',
      'Excursiones: Sierra Nevada, Costa, Alpujarras',
    ],
    color: 'border-clinic-green',
  },
  {
    n: 'Mes 3',
    titulo: 'Consolidación y cierre',
    items: [
      'Presentación oficial de la mini serie web',
      'Evaluación y retroalimentación continua',
      'Fiesta Final y entrega de certificados',
    ],
    color: 'border-clinic-gold',
  },
];

const planes: {
  id: PlanId;
  nombre: string;
  precio: string;
  periodo: string;
  desc: string;
  features: string[];
  destacado: boolean;
}[] = [
  {
    id: 'mensual',
    nombre: 'Mensual',
    precio: '350€',
    periodo: '/ mes',
    desc: 'Matrícula flexible, mes a mes.',
    features: [
      'Clínicas presenciales (mar y jue mañana, mié tarde)',
      'Acceso completo a Farmacias y talleres',
      'Tutoría con tu pareja lingüística (Seguro LC)',
      'Seguro LC con descuentos en actividades',
      'Certificado de aprovechamiento al completar',
    ],
    destacado: false,
  },
  {
    id: 'curso',
    nombre: 'Curso completo',
    precio: '945€',
    periodo: '/ 3 meses',
    desc: 'Todo lo del plan mensual, los 3 meses. Ahorra 160€ (−15%).',
    features: [
      'Los 3 meses completos del programa',
      'Acceso total a Farmacias, talleres y tutoría',
      'Mini serie web + Laboratorio de cine',
      'Seguro LC con descuentos en actividades y excursiones',
      'Certificado de aprovechamiento',
    ],
    destacado: true,
  },
  {
    id: 'demanda',
    nombre: 'A demanda',
    precio: '5€',
    periodo: '/ hora',
    desc: 'Paga por horas. Ideal para estancias cortas.',
    features: [
      'Diagnóstico y La Doctora (IA), gratis',
      'Pagas solo las horas presenciales que asistas',
      'Cada bono de horas abre toda la clínica digital esa semana',
      'Actividades culturales a precio completo',
      'Certificado de aprovechamiento al completar',
    ],
    destacado: false,
  },
];

export default async function ProgramaPage() {
  const user = await getSessionUser();
  return (
    <main className="min-h-screen bg-clinic-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-clinic-gray bg-white">
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

      {/* Intro band */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/imgs/secciones/empedrado.jpg"
          alt="Empedrado granadino"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-clinic-blue/85" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-white/15 text-clinic-gold font-semibold text-sm mb-4">
            Curso inmersivo · 3 meses
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow">El Programa</h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">
            Tres meses de español vivido en Granada: martes, miércoles y jueves —martes y jueves de
            10:00 a 14:00, miércoles de 16:00 a 20:00 (12 h semanales)— combinando clínicas
            lingüísticas, cultura y la producción de una mini serie web.
          </p>
        </div>
      </section>

      {/* Fases */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-clinic-blue text-center mb-10">Las tres fases</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {fases.map((f) => (
            <div key={f.n} className={`bg-white border-l-4 ${f.color} border border-clinic-gray rounded-2xl p-6`}>
              <p className="text-sm font-bold text-clinic-gold uppercase">{f.n}</p>
              <h3 className="text-xl font-bold text-clinic-blue mb-3">{f.titulo}</h3>
              <ul className="space-y-2 text-clinic-blue/70 text-sm">
                {f.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-clinic-green">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section className="bg-clinic-gray/30 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-clinic-blue text-center mb-2">Precios</h2>
          <p className="text-center text-clinic-blue/60 mb-10">
            Pensado para ser autofinanciable. Elige la modalidad que mejor te encaje.
          </p>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {planes.map((p) => (
              <div
                key={p.nombre}
                className={`rounded-2xl p-8 bg-white border ${
                  p.destacado
                    ? 'border-clinic-red shadow-xl md:-translate-y-2'
                    : 'border-clinic-gray'
                }`}
              >
                {p.destacado && (
                  <span className="inline-block mb-3 px-3 py-1 rounded-full bg-clinic-red text-white text-xs font-bold">
                    Más popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-clinic-blue">{p.nombre}</h3>
                <div className="my-3">
                  <span className="text-4xl font-bold text-clinic-blue">{p.precio}</span>
                  <span className="text-clinic-blue/50"> {p.periodo}</span>
                </div>
                <p className="text-sm text-clinic-blue/60 mb-5">{p.desc}</p>
                <ul className="space-y-2 text-sm text-clinic-blue/70 mb-6">
                  {p.features.map((ft) => (
                    <li key={ft} className="flex gap-2">
                      <span className="text-clinic-green">✓</span>
                      {ft}
                    </li>
                  ))}
                </ul>
                <MatriculaButton plan={p.id} destacado={p.destacado}>
                  Matricularme
                </MatriculaButton>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-clinic-blue/70 mt-8">
            ¿Solo curioseando?{' '}
            <a href="/login" className="text-clinic-red underline font-semibold">
              Regístrate gratis
            </a>{' '}
            y prueba el diagnóstico, La Doctora y una muestra de los recursos.
          </p>
          <p className="text-center text-xs text-clinic-blue/40 mt-3">
            Las actividades y excursiones culturales se pagan aparte (con descuento del Seguro LC para
            las suscripciones). Precio del curso completo sin descuento: 1.105€; el pago anticipado
            aplica un 15% (945€). Importes orientativos del proyecto.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
