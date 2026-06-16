// Laboratorio de cine: la mini serie web de la Clínica como proyecto colectivo.
//
// El "archivo del laboratorio" se muestra incrustando una carpeta PÚBLICA de
// Google Drive (compartida como "cualquiera con el enlace"). Pega aquí el ID
// de la carpeta (la parte de la URL .../folders/ESTE_ID).

export const LAB = {
  // ID de la carpeta pública de Drive con todo el material (guiones, tomas,
  // fotos, fichas de personajes…). Vacío = aún sin conectar.
  driveFolderId: '138ChiO2PMv3kSU8JGiCLkZdxeaejFH6w',
  serie: {
    titulo: 'La mini serie de la Clínica',
    sinopsis:
      'A lo largo del curso, los estudiantes escriben, ruedan y montan una mini serie web en español. Cada capítulo es un proyecto de equipo: del guion al estreno.',
  },
};

export type FaseCapitulo = 'guion' | 'rodaje' | 'montaje' | 'estreno';

export interface CapituloLab {
  numero: number;
  titulo: string;
  sinopsis: string;
  fase: FaseCapitulo;
}

// Capítulos de la mini serie. Edítalos según el proyecto real del Drive.
export const CAPITULOS: CapituloLab[] = [
  { numero: 1, titulo: 'Capítulo 1', sinopsis: 'Presentación de los personajes y el conflicto inicial.', fase: 'estreno' },
  { numero: 2, titulo: 'Capítulo 2', sinopsis: 'El nudo: las cosas se complican.', fase: 'montaje' },
  { numero: 3, titulo: 'Capítulo 3', sinopsis: 'Rodaje en marcha.', fase: 'rodaje' },
  { numero: 4, titulo: 'Capítulo 4', sinopsis: 'En fase de escritura del guion.', fase: 'guion' },
];

export const FASE_INFO: Record<FaseCapitulo, { label: string; icon: string; clase: string }> = {
  guion: { label: 'Guion', icon: '📝', clase: 'bg-clinic-gold/15 text-clinic-gold' },
  rodaje: { label: 'Rodaje', icon: '🎬', clase: 'bg-clinic-red/15 text-clinic-red' },
  montaje: { label: 'Montaje', icon: '✂️', clase: 'bg-clinic-blue/10 text-clinic-blue' },
  estreno: { label: 'Estreno', icon: '✅', clase: 'bg-clinic-green/15 text-clinic-green' },
};

// Cómo se trabaja en un laboratorio de cine real (metodología del taller).
export const METODOLOGIA: { fase: string; icon: string; pasos: string[] }[] = [
  {
    fase: 'Preproducción',
    icon: '🗂️',
    pasos: [
      'Idea y sinopsis',
      'Escaleta y guion',
      'Fichas de personajes',
      'Localizaciones y casting',
      'Plan de rodaje y storyboard',
    ],
  },
  {
    fase: 'Producción (rodaje)',
    icon: '🎥',
    pasos: [
      'Grabación de las tomas según el plan',
      'Claqueta y registro de tomas',
      'Sonido directo y fotografía',
    ],
  },
  {
    fase: 'Postproducción',
    icon: '✂️',
    pasos: [
      'Visionado y selección de tomas',
      'Montaje y edición',
      'Color, sonido y música',
      'Subtítulos en español',
    ],
  },
  {
    fase: 'Estreno',
    icon: '🎬',
    pasos: ['Exportación del capítulo', 'Presentación pública', 'Publicación de la mini serie'],
  },
];
