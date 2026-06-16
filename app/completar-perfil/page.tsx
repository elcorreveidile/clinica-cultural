import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Logo from '@/components/Logo';
import FichaForm from '@/components/FichaForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Completa tu ficha · Clínica Cultural' };

export default async function CompletarPerfilPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  // Si la ficha ya está completa (tiene nombre), no hace falta repetirla.
  if (sessionUser.fullName) redirect('/dashboard');

  const u = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  const inicial = {
    fullName: u?.fullName ?? '',
    nationality: u?.nationality ?? '',
    nativeLanguage: u?.nativeLanguage ?? '',
    dateOfBirth: u?.dateOfBirth ? u.dateOfBirth.toISOString().slice(0, 10) : '',
    phone: u?.phone ?? '',
    bio: u?.bio ?? '',
  };

  return (
    <main className="min-h-screen bg-clinic-gray/30 flex flex-col">
      <header className="border-b border-clinic-gray bg-white">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <Logo />
        </div>
      </header>

      <section className="flex-1 px-4 py-10">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📋</div>
            <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue">
              Tu ficha de paciente
            </h1>
            <p className="text-clinic-blue/60 mt-1">
              Antes de empezar tu tratamiento, completa tu historia clínica lingüística. Solo te
              llevará un minuto.
            </p>
          </div>

          <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8 shadow-sm">
            <FichaForm inicial={inicial} />
          </div>

          <p className="text-center text-xs text-clinic-blue/40 mt-4">
            Tus datos se tratan conforme a nuestra{' '}
            <a href="/legal/privacidad" className="underline">política de privacidad</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
