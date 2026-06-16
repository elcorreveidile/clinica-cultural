'use client';

import 'leaflet/dist/leaflet.css';
import { Fragment, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import type { Ruta } from '@/lib/rutas';

const CENTRO: [number, number] = [37.1773, -3.5916]; // Granada

export default function MapaRutas({ rutas }: { rutas: Ruta[] }) {
  const [activa, setActiva] = useState<string>('todas');
  const visibles = activa === 'todas' ? rutas : rutas.filter((r) => r.slug === activa);

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiva('todas')}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
            activa === 'todas'
              ? 'bg-clinic-blue text-white border-clinic-blue'
              : 'border-clinic-gray text-clinic-blue/70 hover:bg-clinic-gray/40'
          }`}
        >
          Todas
        </button>
        {rutas.map((r) => (
          <button
            key={r.slug}
            onClick={() => setActiva(r.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
              activa === r.slug ? 'text-white' : 'text-clinic-blue/70 hover:bg-clinic-gray/40'
            }`}
            style={
              activa === r.slug
                ? { backgroundColor: r.color, borderColor: r.color }
                : { borderColor: '#E8E8E8' }
            }
          >
            {r.titulo}
          </button>
        ))}
      </div>

      <MapContainer
        center={CENTRO}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '70vh', width: '100%', borderRadius: '1rem' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visibles.map((r) => (
          <Fragment key={r.slug}>
            <Polyline
              positions={r.paradas.map((p) => p.coords)}
              pathOptions={{ color: r.color, weight: 4, opacity: 0.7 }}
            />
            {r.paradas.map((p, i) => (
              <CircleMarker
                key={`${r.slug}-${i}`}
                center={p.coords}
                radius={9}
                pathOptions={{ color: '#ffffff', weight: 2, fillColor: r.color, fillOpacity: 1 }}
              >
                <Popup>
                  <strong>{p.nombre}</strong>
                  <br />
                  <span style={{ fontSize: 12 }}>{p.descripcion}</span>
                </Popup>
              </CircleMarker>
            ))}
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
