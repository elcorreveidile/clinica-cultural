import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

export const metadata = { title: 'Matrícula confirmada · Clínica Cultural' };

export default function MatriculaExitoPage() {
  return (
    <main className="min-h-screen bg-clinic-white flex flex-col">
      <header className="border-b border-clinic-gray bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white border border-clinic-gray rounded-2xl p-10 max-w-md w-full text-center shadow-sm animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-clinic-green mb-2">¡Matrícula confirmada!</h1>
          <p className="text-clinic-blue/70 mb-6">
            Gracias por unirte a la Clínica Cultural y Lingüística. Te enviaremos los detalles del
            curso por email. Tu plan de tratamiento lingüístico te espera.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-clinic-red text-white rounded-xl font-bold hover:bg-clinic-red/90"
            >
              Ir a mi Dashboard
            </Link>
            <Link href="/" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
