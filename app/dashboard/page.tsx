import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { displayName } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [diagnosis, seguro] = await Promise.all([
    prisma.diagnosis.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.seguroLC.findUnique({ where: { userId: user.id } }),
  ]);

  const cards = [
    {
      href: '/dashboard/diagnostico',
      title: 'Diagnóstico',
      icon: '/imgs/iconos/diagnostico_icon.png',
      status: user.currentLevel
        ? `Nivel diagnosticado: ${user.currentLevel}`
        : diagnosis
          ? 'Diagnóstico en curso'
          : 'Pendiente de realizar',
      color: 'border-clinic-red',
    },
    {
      href: '/dashboard/farmacias',
      title: 'Farmacias Lingüísticas',
      icon: '/imgs/iconos/farmacia_icon.png',
      status: 'Píldoras, pomadas y jarabes a tu nivel',
      color: 'border-clinic-green',
    },
    {
      href: '/dashboard/seguro-lc',
      title: 'Seguro LC',
      icon: '/imgs/iconos/seguro_icon.png',
      status: seguro ? `Tarjeta ${seguro.cardNumber}` : 'Sin activar todavía',
      color: 'border-clinic-gold',
    },
    {
      href: '/dashboard/emergencia',
      title: 'Emergencia Lingüística',
      icon: '/imgs/iconos/emergencia_icon.png',
      status: 'Chatea con El Doctor (IA) ahora',
      color: 'border-clinic-blue',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-clinic-gray rounded-2xl p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue">
          Hola, {displayName(user)} 👋
        </h1>
        <p className="text-clinic-blue/60 mt-1">
          Bienvenido a tu historia clínica lingüística. ¿Por dónde empezamos hoy?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`block bg-white border-l-4 ${c.color} border border-clinic-gray rounded-2xl p-6 hover:shadow-md transition`}
          >
            <img src={c.icon} alt="" className="w-12 h-12 mb-3 object-contain" />
            <h2 className="text-lg font-bold text-clinic-blue">{c.title}</h2>
            <p className="text-clinic-blue/60 text-sm mt-1">{c.status}</p>
          </Link>
        ))}
      </div>

      {!user.currentLevel && (
        <div className="bg-clinic-red/5 border border-clinic-red/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-clinic-red">Aún no tienes diagnóstico</h3>
            <p className="text-clinic-blue/60 text-sm">
              Haz tu test de nivel para desbloquear tu plan de tratamiento.
            </p>
          </div>
          <Link
            href="/dashboard/diagnostico"
            className="px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90 whitespace-nowrap"
          >
            Empezar diagnóstico
          </Link>
        </div>
      )}
    </div>
  );
}
