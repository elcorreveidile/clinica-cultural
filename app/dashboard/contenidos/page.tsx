import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ImportarButton from '@/components/Contenidos/ImportarButton';
import FarmaciaForm from '@/components/Contenidos/FarmaciaForm';

export const dynamic = 'force-dynamic';

const ROLES_GESTION = ['professor', 'admin'];

export default async function ContenidosPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!ROLES_GESTION.includes(user.role)) redirect('/dashboard');

  const farmacias = await prisma.farmacia.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { recursos: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🗂️ Gestión de contenidos
        </h1>
        <p className="text-clinic-blue/60">
          Crea farmacias y gestiona sus recursos (lecturas, ejercicios, léxico…).
        </p>
      </div>

      {/* Importar contenido base */}
      <div className="bg-clinic-green/5 border border-clinic-green/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-clinic-blue/70">
          ¿Primera vez? Importa a la base de datos el contenido que viene de fábrica (cápsulas de la
          Alhambra, píldoras de gramática…) para poder editarlo. No duplica lo ya importado.
        </p>
        <ImportarButton />
      </div>

      {/* Crear farmacia */}
      <FarmaciaForm />

      {/* Farmacias existentes */}
      <div className="bg-white border border-clinic-gray rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-clinic-gray">
          <h2 className="font-bold text-clinic-blue">Farmacias</h2>
        </div>
        {farmacias.length === 0 ? (
          <p className="px-6 py-5 text-sm text-clinic-blue/50">Aún no hay farmacias. Crea la primera arriba.</p>
        ) : (
          <ul className="divide-y divide-clinic-gray/60">
            {farmacias.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/dashboard/contenidos/${f.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-clinic-gray/20"
                >
                  <div>
                    <p className="font-medium text-clinic-blue">{f.name}</p>
                    <p className="text-xs text-clinic-blue/50">
                      {f.category ?? 'sin categoría'} · {f._count.recursos} recursos
                    </p>
                  </div>
                  <span className="text-clinic-blue/40 text-sm">Gestionar →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
