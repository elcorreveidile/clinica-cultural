// Catálogo de actividades culturales de la Clínica (datos del programa del proyecto).
// El precio base es por participante; con Seguro LC se aplica un descuento.

export const SEGURO_LC_DESCUENTO = 0.2; // 20%

export type CategoriaActividad =
  | 'gastronomia'
  | 'naturaleza'
  | 'patrimonio'
  | 'fotografia'
  | 'cine'
  | 'escritura'
  | 'conversacion'
  | 'evento';

export interface Actividad {
  id: string;
  nombre: string;
  categoria: CategoriaActividad;
  descripcion: string;
  lugar: string;
  duracionH: number;
  precio: number; // €
  nivel?: string; // MCER objetivo (opcional)
}

export const CATEGORIAS: Record<CategoriaActividad, { label: string; icon: string }> = {
  gastronomia: { label: 'Gastronomía', icon: '🍷' },
  naturaleza: { label: 'Naturaleza', icon: '🏔️' },
  patrimonio: { label: 'Patrimonio', icon: '🏛️' },
  fotografia: { label: 'Fotografía', icon: '📸' },
  cine: { label: 'Laboratorio de cine', icon: '🎬' },
  escritura: { label: 'Escuela de Poetas', icon: '✍️' },
  conversacion: { label: 'Conversación', icon: '💬' },
  evento: { label: 'Eventos', icon: '🎉' },
};

export const ACTIVIDADES: Actividad[] = [
  {
    id: 'ruta-tapas',
    nombre: 'Ruta de tapas e intercambio lingüístico',
    categoria: 'gastronomia',
    descripcion: 'Recorrido por los bares de Granada combinando tapas y conversación real en español.',
    lugar: 'Centro de Granada',
    duracionH: 2,
    precio: 10,
    nivel: 'A2-B2',
  },
  {
    id: 'mercado-san-agustin',
    nombre: 'Mercado San Agustín y cocina española',
    categoria: 'gastronomia',
    descripcion: 'Visita al mercado y taller de cocina española con vocabulario gastronómico.',
    lugar: 'Mercado San Agustín',
    duracionH: 3,
    precio: 15,
  },
  {
    id: 'safari-foto',
    nombre: 'Safari fotográfico por Granada',
    categoria: 'fotografia',
    descripcion: 'Captura los rincones de Granada mientras trabajas la narrativa visual y el léxico.',
    lugar: 'Albaicín y centro',
    duracionH: 3,
    precio: 15,
  },
  {
    id: 'safari-foto-nocturno',
    nombre: 'Safari fotográfico nocturno',
    categoria: 'fotografia',
    descripcion: 'Granada de noche: la Alhambra iluminada y los miradores del Albaicín.',
    lugar: 'Mirador de San Nicolás',
    duracionH: 3,
    precio: 15,
  },
  {
    id: 'alhambra',
    nombre: 'Excursión cultural: la Alhambra',
    categoria: 'patrimonio',
    descripcion: 'Visita guiada al monumento con vocabulario de historia, arte y arquitectura.',
    lugar: 'La Alhambra',
    duracionH: 3,
    precio: 15,
  },
  {
    id: 'sierra-nevada',
    nombre: 'Excursión: día en Sierra Nevada',
    categoria: 'naturaleza',
    descripcion: 'Jornada en la montaña: naturaleza, deporte y conversación al aire libre.',
    lugar: 'Sierra Nevada',
    duracionH: 6,
    precio: 30,
  },
  {
    id: 'costa-tropical',
    nombre: 'Visita cultural: Costa Tropical',
    categoria: 'naturaleza',
    descripcion: 'Día en la costa granadina, sus pueblos y su gastronomía marinera.',
    lugar: 'Costa de Granada',
    duracionH: 4,
    precio: 20,
  },
  {
    id: 'alpujarras',
    nombre: 'Alpujarras: bodega y fábrica de aceite',
    categoria: 'naturaleza',
    descripcion: 'Ruta por las Alpujarras con visita a bodega y almazara, y cata guiada.',
    lugar: 'Las Alpujarras',
    duracionH: 4,
    precio: 20,
  },
  {
    id: 'aula-cine',
    nombre: 'Aula de cine: mini serie web',
    categoria: 'cine',
    descripcion: 'Guionización, grabación y edición de la mini serie web del curso, en equipo.',
    lugar: 'Espacio V Centenario',
    duracionH: 3,
    precio: 10,
  },
  {
    id: 'escuela-poetas',
    nombre: 'Escuela de Poetas: taller de poesía',
    categoria: 'escritura',
    descripcion: 'Pronunciación, prosodia y creación poética. Lectura en público.',
    lugar: 'CLM · Espacio V Centenario',
    duracionH: 1.5,
    precio: 7.5,
  },
  {
    id: 'taller-escritura',
    nombre: 'Taller de escritura creativa y guionización',
    categoria: 'escritura',
    descripcion: 'Desarrolla tu expresión escrita y participa en el guion de la mini serie.',
    lugar: 'CLM · Espacio V Centenario',
    duracionH: 2,
    precio: 10,
  },
  {
    id: 'simulaciones',
    nombre: 'Simulaciones en contextos reales',
    categoria: 'conversacion',
    descripcion: 'Entrevistas de trabajo, visita al médico o trámites: practica situaciones reales.',
    lugar: 'CLM',
    duracionH: 2,
    precio: 10,
  },
  {
    id: 'mesa-redonda',
    nombre: 'Mesa redonda: diálogo intercultural',
    categoria: 'conversacion',
    descripcion: 'Debate y puesta en común de experiencias de vida en España.',
    lugar: 'CLM',
    duracionH: 2,
    precio: 10,
  },
  {
    id: 'clausura',
    nombre: 'Evento de clausura y Fiesta Final',
    categoria: 'evento',
    descripcion: 'Presentación de la mini serie y celebración de los logros del curso.',
    lugar: 'Espacio V Centenario',
    duracionH: 3,
    precio: 15,
  },
];

/** Devuelve el precio con descuento si el usuario tiene Seguro LC activo. */
export function precioConDescuento(precio: number): number {
  return Math.round(precio * (1 - SEGURO_LC_DESCUENTO) * 100) / 100;
}
