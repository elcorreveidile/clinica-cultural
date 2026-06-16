import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import RolSelect from '@/components/Admin/RolSelect';
import AltaUsuarioForm from '@/components/Admin/AltaUsuarioForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  // Solo administradores.
  if (user.role !== 'admin') redirect('/dashboard');

  const [users, userCount, diagCount, seguroCount, farmaciaCount, chatCount] =
    await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          currentLevel: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
      prisma.diagnosis.count(),
      prisma.seguroLC.count(),
      prisma.farmacia.count(),
      prisma.chatLineaEmergencia.count(),
    ]);

  const stats = [
    { label: 'Usuarios', value: userCount, icon: '👥' },
    { label: 'Diagnósticos', value: diagCount, icon: '🩺' },
    { label: 'Seguros LC', value: seguroCount, icon: '🪪' },
    { label: 'Farmacias', value: farmaciaCount, icon: '💊' },
    { label: 'Consultas IA', value: chatCount, icon: '🚨' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🛡️ Administración
        </h1>
        <p className="text-clinic-blue/60">
          Panel del super administrador. Visión global de la clínica.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-clinic-gray rounded-2xl p-5 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold text-clinic-blue">{s.value}</div>
            <div className="text-xs text-clinic-blue/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alta de profesores / gestión de roles */}
      <AltaUsuarioForm />

      {/* Usuarios */}
      <div className="bg-white border border-clinic-gray rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-clinic-gray flex items-center justify-between">
          <h2 className="font-bold text-clinic-blue">Usuarios recientes</h2>
          <span className="text-sm text-clinic-blue/50">
            mostrando {users.length} de {userCount}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-blue/50 border-b border-clinic-gray">
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Nivel</th>
                <th className="px-6 py-3 font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-clinic-gray/60 last:border-0">
                  <td className="px-6 py-3 text-clinic-blue font-medium">{u.email}</td>
                  <td className="px-6 py-3 text-clinic-blue/70">{u.fullName ?? '—'}</td>
                  <td className="px-6 py-3">
                    <RolSelect userId={u.id} rol={u.role} disabled={u.id === user.id} />
                  </td>
                  <td className="px-6 py-3 text-clinic-blue/70">{u.currentLevel ?? '—'}</td>
                  <td className="px-6 py-3 text-clinic-blue/50">
                    {new Date(u.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
