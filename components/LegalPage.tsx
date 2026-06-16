import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

export default function LegalPage({
  title,
  updated = 'junio de 2026',
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-clinic-white flex flex-col">
      <header className="sticky top-0 z-20 border-b border-clinic-gray bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo />
          <Link href="/" className="text-clinic-blue/70 hover:text-clinic-blue text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto w-full px-6 py-12 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-2">{title}</h1>
        <p className="text-clinic-blue/50 text-sm mb-8">Última actualización: {updated}</p>

        <div className="space-y-5 text-clinic-blue/80 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-clinic-blue [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-clinic-red [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          {children}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-clinic-gold/10 border border-clinic-gold/30 text-sm text-clinic-blue/70">
          ⚠️ <strong>Borrador.</strong> Este texto es una plantilla orientativa y debe ser revisado
          y adaptado por un profesional legal antes de su publicación definitiva (datos del
          responsable, finalidades reales del tratamiento, encargados, etc.).
        </div>
      </article>

      <Footer />
    </main>
  );
}
