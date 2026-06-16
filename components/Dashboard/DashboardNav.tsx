'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const baseItems = [
  { href: '/dashboard', label: 'Resumen', icon: '🏠' },
  { href: '/dashboard/diagnostico', label: 'Diagnóstico', icon: '🩺' },
  { href: '/dashboard/farmacias', label: 'Farmacias', icon: '💊' },
  { href: '/dashboard/actividades', label: 'Actividades', icon: '📅' },
  { href: '/dashboard/laboratorio-cine', label: 'Laboratorio de cine', icon: '🎬' },
  { href: '/dashboard/escuela-poetas', label: 'Escuela de Poetas', icon: '✍️' },
  { href: '/dashboard/tutoria', label: 'Tutoría', icon: '👥' },
  { href: '/dashboard/enfermeria-lc', label: 'Enfermería LC', icon: '🤝' },
  { href: '/dashboard/portafolio', label: 'Portafolio', icon: '📂' },
  { href: '/dashboard/seguro-lc', label: 'Seguro LC', icon: '🪪' },
  { href: '/dashboard/emergencia', label: 'Emergencia IA', icon: '🚨' },
];

const profesorItem = { href: '/dashboard/profesor', label: 'Panel profesor', icon: '🩺' };
const adminItem = { href: '/dashboard/admin', label: 'Administración', icon: '🛡️' };

export default function DashboardNav({
  isAdmin = false,
  isProfesor = false,
}: {
  isAdmin?: boolean;
  isProfesor?: boolean;
}) {
  const pathname = usePathname();
  const items = [
    ...baseItems,
    ...(isProfesor ? [profesorItem] : []),
    ...(isAdmin ? [adminItem] : []),
  ];

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
