// Rutas culturales de la Clínica por Granada. Cada parada incluye una nota
// lingüística/cultural. Coordenadas aproximadas [lat, lng].

export interface Parada {
  nombre: string;
  coords: [number, number];
  descripcion: string;
}

export interface Ruta {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  color: string; // color de la ruta (marcadores y línea)
  duracion: string;
  distancia: string;
  nivel: string; // MCER sugerido
  paradas: Parada[];
}

export const RUTAS: Ruta[] = [
  {
    slug: 'alhambra',
    titulo: 'Ruta de la Alhambra',
    subtitulo: 'El castillo rojo de los nazaríes',
    descripcion:
      'Un recorrido por la ciudad palatina nazarí: de la Puerta de la Justicia a los jardines del Generalife.',
    color: '#D84C4C',
    duracion: '3 h',
    distancia: '2,5 km',
    nivel: 'B1',
    paradas: [
      {
        nombre: 'Puerta de la Justicia',
        coords: [37.1755, -3.5905],
        descripcion: 'La gran puerta de entrada, con su arco de herradura. Léxico: puerta, arco, muralla.',
      },
      {
        nombre: 'Alcazaba · Torre de la Vela',
        coords: [37.1766, -3.5921],
        descripcion: 'La parte militar y las mejores vistas de Granada. Léxico: torre, fortaleza, vistas.',
      },
      {
        nombre: 'Palacios Nazaríes',
        coords: [37.1769, -3.5896],
        descripcion: 'El corazón del palacio: yeserías, alicatados y el Patio de los Arrayanes.',
      },
      {
        nombre: 'Patio de los Leones',
        coords: [37.1770, -3.5888],
        descripcion: 'La fuente con doce leones de mármol, símbolo de la Alhambra.',
      },
      {
        nombre: 'Generalife',
        coords: [37.1766, -3.5836],
        descripcion: 'Los jardines de recreo de los sultanes y el Patio de la Acequia.',
      },
    ],
  },
  {
    slug: 'albaicin-sacromonte',
    titulo: 'Ruta del Albaicín y Sacromonte',
    subtitulo: 'Miradores, cármenes y flamenco',
    descripcion:
      'Calles empinadas, vistas a la Alhambra y el barrio del flamenco. La Granada más auténtica.',
    color: '#5A8C6E',
    duracion: '2,5 h',
    distancia: '3 km',
    nivel: 'A2',
    paradas: [
      {
        nombre: 'Plaza Nueva',
        coords: [37.1772, -3.5957],
        descripcion: 'Punto de partida y la plaza más antigua. Léxico: plaza, fuente, terraza.',
      },
      {
        nombre: 'Carrera del Darro',
        coords: [37.1775, -3.5928],
        descripcion: 'Una de las calles más bonitas de España, junto al río Darro.',
      },
      {
        nombre: 'Paseo de los Tristes',
        coords: [37.1782, -3.5901],
        descripcion: 'Vistas espectaculares de la Alhambra iluminada. Ideal al atardecer.',
      },
      {
        nombre: 'Mirador de San Nicolás',
        coords: [37.1808, -3.5925],
        descripcion: 'La postal de Granada: la Alhambra con Sierra Nevada al fondo.',
      },
      {
        nombre: 'Sacromonte',
        coords: [37.1846, -3.5840],
        descripcion: 'El barrio de las cuevas y el flamenco (zambra). Léxico: cueva, guitarra, baile.',
      },
    ],
  },
  {
    slug: 'tapas-centro',
    titulo: 'Ruta de tapas por el centro',
    subtitulo: 'Comer (casi) gratis y practicar español',
    descripcion:
      'De bar en bar por el centro histórico: la mejor forma de practicar español en situaciones reales.',
    color: '#D4A574',
    duracion: '2 h',
    distancia: '1,8 km',
    nivel: 'A2',
    paradas: [
      {
        nombre: 'Plaza Nueva',
        coords: [37.1772, -3.5957],
        descripcion: 'Arrancamos con una caña y la primera tapa. "¿Me pones una caña, por favor?"',
      },
      {
        nombre: 'Catedral y Capilla Real',
        coords: [37.1765, -3.5996],
        descripcion: 'Una pausa cultural entre tapa y tapa. Léxico: catedral, capilla, entrada.',
      },
      {
        nombre: 'Plaza Bib-Rambla',
        coords: [37.1748, -3.5986],
        descripcion: 'Terrazas, flores y churros con chocolate. "La cuenta, por favor."',
      },
      {
        nombre: 'Corral del Carbón',
        coords: [37.1747, -3.5975],
        descripcion: 'El monumento andalusí civil más antiguo de la ciudad.',
      },
      {
        nombre: 'Mercado San Agustín',
        coords: [37.1779, -3.6003],
        descripcion: 'Productos frescos y vocabulario de comida. "¿A cuánto está el jamón?"',
      },
      {
        nombre: 'Campo del Príncipe (Realejo)',
        coords: [37.1722, -3.5907],
        descripcion: 'El antiguo barrio judío, lleno de bares de tapas. Cierre perfecto.',
      },
    ],
  },
];

export function rutaPorSlug(slug: string): Ruta | undefined {
  return RUTAS.find((r) => r.slug === slug);
}
