'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; icon: string };

// Catálogo de secciones.
const I = {
  resumen: { href: '/dashboard', label: 'Resumen', icon: '🏠' },
  diagnostico: { href: '/dashboard/diagnostico', label: 'Diagnóstico', icon: '🩺' },
  farmacias: { href: '/dashboard/farmacias', label: 'Farmacias', icon: '💊' },
  actividades: { href: '/dashboard/actividades', label: 'Actividades', icon: '📅' },
  rutas: { href: '/dashboard/rutas', label: 'Rutas', icon: '🗺️' },
  laboratorio: { href: '/dashboard/laboratorio-cine', label: 'Laboratorio de cine', icon: '🎬' },
  poetas: { href: '/dashboard/escuela-poetas', label: 'Escuela de Poetas', icon: '✍️' },
  tutoria: { href: '/dashboard/tutoria', label: 'Tutoría', icon: '👥' },
  enfermeria: { href: '/dashboard/enfermeria-lc', label: 'Enfermería LC', icon: '🤝' },
  portafolio: { href: '/dashboard/portafolio', label: 'Portafolio', icon: '📂' },
  seguro: { href: '/dashboard/seguro-lc', label: 'Seguro LC', icon: '🪪' },
  emergencia: { href: '/dashboard/emergencia', label: 'Emergencia IA', icon: '🚨' },
  ajustes: { href: '/dashboard/settings', label: 'Ajustes', icon: '⚙️' },
  contenidos: { href: '/dashboard/contenidos', label: 'Contenidos', icon: '🗂️' },
  profesor: { href: '/dashboard/profesor', label: 'Panel profesor', icon: '🩺' },
  admin: { href: '/dashboard/admin', label: 'Administración', icon: '🛡️' },
} satisfies Record<string, Item>;

// Menú según el rol del usuario.
function itemsParaRol(role: string): Item[] {
  switch (role) {
    case 'admin':
      return [I.resumen, I.admin, I.profesor, I.contenidos, I.tutoria, I.ajustes];
    case 'professor':
      return [I.resumen, I.profesor, I.contenidos, I.tutoria, I.ajustes];
    case 'tutor_local':
      return [I.resumen, I.enfermeria, I.tutoria, I.seguro, I.actividades, I.rutas, I.ajustes];
    default: // patient
      return [
        I.resumen,
        I.diagnostico,
        I.farmacias,
        I.actividades,
        I.rutas,
        I.laboratorio,
        I.poetas,
        I.tutoria,
        I.enfermeria,
        I.portafolio,
        I.seguro,
        I.emergencia,
        I.ajustes,
      ];
  }
}

export default function DashboardNav({ role = 'patient' }: { role?: string }) {
  const pathname = usePathname();
  const items = itemsParaRol(role);

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
