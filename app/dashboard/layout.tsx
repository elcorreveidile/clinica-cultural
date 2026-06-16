import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { displayName } from '@/lib/utils';
import DashboardNav from '@/components/Dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-clinic-gray/30">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-clinic-gray">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <span className="font-bold text-clinic-red font-heading">Clínica Cultural</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-sm text-clinic-blue/70">
              <span className="w-8 h-8 rounded-full bg-clinic-green text-white flex items-center justify-center font-bold uppercase">
                {displayName(user).charAt(0)}
              </span>
              {displayName(user)}
            </span>
            <form action="/api/auth/logout" method="post">
              <button className="text-sm px-3 py-1.5 rounded-lg border border-clinic-gray hover:bg-clinic-gray/40 text-clinic-blue/70">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row gap-6">
        <aside className="md:w-60 shrink-0">
          <DashboardNav isAdmin={user.role === 'admin'} />
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
