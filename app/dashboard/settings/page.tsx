import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import FichaForm from '@/components/FichaForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login');

  const u = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  const inicial = {
    fullName: u?.fullName ?? '',
    nationality: u?.nationality ?? '',
    nativeLanguage: u?.nativeLanguage ?? '',
    dateOfBirth: u?.dateOfBirth ? u.dateOfBirth.toISOString().slice(0, 10) : '',
    phone: u?.phone ?? '',
    bio: u?.bio ?? '',
    profilePictureUrl: u?.profilePictureUrl ?? '',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          ⚙️ Ajustes
        </h1>
        <p className="text-clinic-blue/60">Edita tu ficha de paciente cuando lo necesites.</p>
      </div>

      {/* Cuenta */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6">
        <h2 className="font-bold text-clinic-blue mb-3">Cuenta</h2>
        <div className="text-sm text-clinic-blue/70 space-y-1">
          <p><span className="text-clinic-blue/50">Email:</span> {sessionUser.email}</p>
          <p><span className="text-clinic-blue/50">Rol:</span> {sessionUser.role}</p>
          {sessionUser.currentLevel && (
            <p><span className="text-clinic-blue/50">Nivel:</span> {sessionUser.currentLevel}</p>
          )}
        </div>
      </div>

      {/* Ficha */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8">
        <h2 className="font-bold text-clinic-blue mb-4">Tu ficha de paciente</h2>
        <FichaForm inicial={inicial} redirectTo={null} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
