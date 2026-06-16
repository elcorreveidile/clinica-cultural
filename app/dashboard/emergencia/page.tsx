import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import ChatBox from '@/components/Chat/ChatBox';

export default async function EmergenciaPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          🚨 Emergencia Lingüística
        </h1>
        <p className="text-clinic-blue/60">
          Tu línea directa con La Doctora (IA). Pregúntale cualquier duda de español.
        </p>
      </div>
      <ChatBox level={user.currentLevel ?? 'B1'} />
    </div>
  );
}
