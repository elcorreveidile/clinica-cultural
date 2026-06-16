'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Resumen', icon: '🏠' },
  { href: '/dashboard/diagnostico', label: 'Diagnóstico', icon: '🩺' },
  { href: '/dashboard/farmacias', label: 'Farmacias', icon: '💊' },
  { href: '/dashboard/seguro-lc', label: 'Seguro LC', icon: '🪪' },
  { href: '/dashboard/emergencia', label: 'Emergencia IA', icon: '🚨' },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border border-clinic-gray rounded-2xl p-2 flex md:flex-col gap-1 overflow-x-auto">
      {items.map((item) => {
        const active =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl whitespace-nowrap font-medium transition',
              active
                ? 'bg-clinic-red text-white'
                : 'text-clinic-blue/70 hover:bg-clinic-gray/40'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
