import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mapDbRecurso } from '@/lib/recursosDb';
import FarmaciaForm from '@/components/Contenidos/FarmaciaForm';
import BorrarFarmaciaButton from '@/components/Contenidos/BorrarFarmaciaButton';
import RecursosManager from '@/components/Contenidos/RecursosManager';

export const dynamic = 'force-dynamic';

const ROLES_GESTION = ['professor', 'admin'];

export default async function GestionFarmaciaPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!ROLES_GESTION.includes(user.role)) redirect('/dashboard');

  const farmacia = await prisma.farmacia.findUnique({ where: { id: params.id } });
  if (!farmacia) notFound();

  const rows = await prisma.recurso.findMany({
    where: { farmaciaId: farmacia.id },
    orderBy: [{ posicion: 'asc' }, { createdAt: 'asc' }],
  });
  const recursos = rows.map((r) => mapDbRecurso(r as never));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard/contenidos" className="text-clinic-blue/60 hover:text-clinic-blue text-sm">
          ← Volver a contenidos
        </Link>
        <BorrarFarmaciaButton id={farmacia.id} nombre={farmacia.name} />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue">{farmacia.name}</h1>

      <FarmaciaForm
        inicial={{
          id: farmacia.id,
          name: farmacia.name,
          category: farmacia.category ?? '',
          targetLevel: farmacia.targetLevel ?? '',
          description: farmacia.description ?? '',
        }}
      />

      <RecursosManager farmaciaId={farmacia.id} recursos={recursos} />
    </div>
  );
}
