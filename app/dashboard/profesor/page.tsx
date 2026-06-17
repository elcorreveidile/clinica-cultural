import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';
import FeedbackForm from '@/components/Dashboard/FeedbackForm';

export const dynamic = 'force-dynamic';

const ROLES_TUTOR = ['professor', 'tutor_local', 'admin'];

export default async function ProfesorPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!ROLES_TUTOR.includes(user.role)) redirect('/dashboard');

  const [pacientes, portafolios, totalPacientes] = await Promise.all([
    // Últimos pacientes
    prisma.user.findMany({
      where: { role: 'patient' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, fullName: true, currentLevel: true },
    }),
    // Portafolios compartidos con el profesor y sin feedback
    prisma.portafolio.findMany({
      where: { visibility: 'shared_with_professor', professorFeedback: null },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.user.count({ where: { role: 'patient' } }),
  ]);

  const stats = [
    { label: 'Pacientes', value: totalPacientes, icon: '🧑‍🎓' },
    { label: 'Portafolios por revisar', value: portafolios.length, icon: '📂' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🩺 Panel del profesor
        </h1>
        <p className="text-clinic-blue/60">
          Revisa portafolios y sigue a tus pacientes.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-clinic-gray rounded-2xl p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold text-clinic-blue">{s.value}</div>
            <div className="text-xs text-clinic-blue/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Portafolios por revisar */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6">
        <h2 className="font-bold text-clinic-blue mb-4">📂 Portafolios por revisar</h2>
        {portafolios.length === 0 ? (
          <p className="text-clinic-blue/50 text-sm">No hay trabajos pendientes de feedback.</p>
        ) : (
          <ul className="space-y-4">
            {portafolios.map((p) => (
              <li key={p.id} className="border border-clinic-gray rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-clinic-blue">{p.title}</p>
                  <span className="text-xs text-clinic-blue/50">{displayName(p.user)}</span>
                </div>
                {p.description && (
                  <p className="text-sm text-clinic-blue/60 mb-3">{p.description}</p>
                )}
                <FeedbackForm portafolioId={p.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pacientes recientes */}
      <div className="bg-white border border-clinic-gray rounded-2xl p-6">
        <h2 className="font-bold text-clinic-blue mb-4">🧑‍🎓 Pacientes recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-clinic-blue/50 border-b border-clinic-gray">
                <th className="py-2 font-medium">Nombre</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="border-b border-clinic-gray/60 last:border-0">
                  <td className="py-2 text-clinic-blue">{p.fullName ?? '—'}</td>
                  <td className="py-2 text-clinic-blue/70">{p.email}</td>
                  <td className="py-2 text-clinic-blue/70">{p.currentLevel ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
