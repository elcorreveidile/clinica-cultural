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
    color: '#E07B2E',
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
  {
    slug: 'flamenco',
    titulo: 'Ruta del flamenco',
    subtitulo: 'El compás de Graná: cante, baile y zambra',
    descripcion:
      'Del corazón del Albaicín a las cuevas del Sacromonte para descubrir la zambra gitana, una forma de flamenco única de Granada.',
    color: '#7C3AED',
    duracion: '2,5 h',
    distancia: '3,5 km',
    nivel: 'B1',
    paradas: [
      {
        nombre: 'Plaza Nueva',
        coords: [37.1772, -3.5957],
        descripcion: 'Punto de encuentro de la ruta. Léxico: compás, palmas, jaleo.',
      },
      {
        nombre: 'Peña de la Platería',
        coords: [37.1782, -3.5912],
        descripcion:
          'La peña flamenca más antigua de España (1949), escondida en el Albaicín. Léxico: peña, cante, palo.',
      },
      {
        nombre: 'Tablao Jardines de Zoraya',
        coords: [37.1823, -3.5897],
        descripcion: 'Un tablao donde ver espectáculo en directo. Léxico: tablao, bailaor, taconeo.',
      },
      {
        nombre: 'Camino del Sacromonte',
        coords: [37.1840, -3.586],
        descripcion: 'La cuesta hacia el barrio gitano, con vistas a la Alhambra. Léxico: cuesta, cueva, barrio.',
      },
      {
        nombre: 'Cuevas del Sacromonte (zambra)',
        coords: [37.1855, -3.5843],
        descripcion:
          'En estas cuevas nació la zambra, la fiesta flamenca gitana de Granada. Léxico: zambra, guitarra, quejío.',
      },
    ],
  },
  {
    slug: 'sacromonte-fondo',
    titulo: 'Sacromonte a fondo',
    subtitulo: 'Cuevas, miradores y la abadía del Valparaíso',
    descripcion:
      'Una ruta más exigente por el barrio de las cuevas: cómo se vivía bajo tierra, miradores escondidos y la abadía en lo alto del monte.',
    color: '#C2255C',
    duracion: '3 h',
    distancia: '4 km',
    nivel: 'B2',
    paradas: [
      {
        nombre: 'Cuesta del Chapiz',
        coords: [37.1808, -3.5897],
        descripcion: 'La frontera entre el Albaicín y el Sacromonte. Léxico: cuesta, ladera, frontera.',
      },
      {
        nombre: 'Museo Cuevas del Sacromonte',
        coords: [37.1872, -3.5836],
        descripcion:
          'Cuevas-vivienda que muestran cómo se vivía aquí. Léxico: cueva-vivienda, oficio, cal.',
      },
      {
        nombre: 'Mirador de la Vereda de Enmedio',
        coords: [37.1849, -3.5849],
        descripcion: 'Vistas del valle del Darro y de la Alhambra desde las cuevas. Léxico: vereda, valle, ladera.',
      },
      {
        nombre: 'Abadía del Sacromonte',
        coords: [37.192, -3.579],
        descripcion:
          'El monasterio en lo alto del monte, con catacumbas y leyenda. Léxico: abadía, catacumba, reliquia.',
      },
    ],
  },
  {
    slug: 'safari-fotografico',
    titulo: 'Safari fotográfico',
    subtitulo: 'Los mejores miradores para tus fotos',
    descripcion:
      'Una ruta pensada para volver con la mejor foto de Granada: encadena los miradores más espectaculares de la ciudad.',
    color: '#0E7C86',
    duracion: '2 h',
    distancia: '3 km',
    nivel: 'A2',
    paradas: [
      {
        nombre: 'Paseo de los Tristes',
        coords: [37.1782, -3.5901],
        descripcion: 'La Alhambra desde abajo, junto al río Darro. Léxico: foto, encuadre, paisaje.',
      },
      {
        nombre: 'Mirador de San Nicolás',
        coords: [37.1808, -3.5925],
        descripcion: 'La postal clásica: la Alhambra con Sierra Nevada al fondo. Léxico: mirador, postal, atardecer.',
      },
      {
        nombre: 'Mirador de la Lona',
        coords: [37.1818, -3.5948],
        descripcion: 'Una vista distinta de los tejados del Albaicín. Léxico: tejado, panorámica, contraluz.',
      },
      {
        nombre: 'Mirador de San Cristóbal',
        coords: [37.1857, -3.5965],
        descripcion: 'La muralla nazarí y la ciudad a tus pies. Léxico: muralla, perfil, horizonte.',
      },
      {
        nombre: 'Placeta de San Miguel Bajo',
        coords: [37.1819, -3.5972],
        descripcion: 'Una placeta con encanto para la última foto. Léxico: placeta, fachada, rincón.',
      },
    ],
  },
];

export function rutaPorSlug(slug: string): Ruta | undefined {
  return RUTAS.find((r) => r.slug === slug);
}
