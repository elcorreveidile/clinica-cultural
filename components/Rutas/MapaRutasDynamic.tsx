'use client';

import dynamic from 'next/dynamic';
import type { Ruta } from '@/lib/rutas';

// Leaflet usa `window`, así que el mapa se carga solo en cliente (sin SSR).
const MapaRutas = dynamic(() => import('./MapaRutas'), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full rounded-2xl bg-clinic-gray/40 flex items-center justify-center text-clinic-blue/50">
      Cargando mapa…
    </div>
  ),
});

export default function MapaRutasDynamic({ rutas }: { rutas: Ruta[] }) {
  return <MapaRutas rutas={rutas} />;
}
