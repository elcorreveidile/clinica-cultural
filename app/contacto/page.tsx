import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import ContactoForm from '@/components/ContactoForm';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contacto · Clínica Cultural',
  description: 'Escríbenos para colaborar con la Clínica Cultural y Lingüística de Español o resolver tus dudas.',
};

export default async function ContactoPage() {
  const user = await getSessionUser();

  return (
    <main className="min-h-screen bg-clinic-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-clinic-gray bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link href="/programa" className="hidden sm:inline text-clinic-blue/70 hover:text-clinic-blue">
              Programa
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

      <section className="flex-1 px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">📬</div>
            <h1 className="text-3xl md:text-4xl font-bold text-clinic-blue">Contacto</h1>
            <p className="text-clinic-blue/60 mt-2">
              ¿Tu entidad quiere colaborar con la Clínica? ¿Tienes una duda? Escríbenos y te
              respondemos lo antes posible.
            </p>
          </div>

          <ContactoForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
