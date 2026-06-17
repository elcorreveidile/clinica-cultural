// Fuente ÚNICA de verdad sobre las secciones y los contenidos de la Clínica.
//
// La Doctora (lib/claude.ts) genera su "memoria" a partir de aquí, e incluso
// lee EN VIVO las rutas y los recursos de las farmacias. Así, cuando se añade
// una ruta nueva, una cápsula nueva o una sección nueva, La Doctora se entera
// automáticamente sin tener que reescribir su prompt a mano.

import { RUTAS } from './rutas';
import { RECURSOS_POR_CATEGORIA, type CategoriaFarmacia } from './recursos';

export interface SeccionClinica {
  label: string;
  ruta: string;
  descripcion: string;
}

// Secciones del panel del paciente. Para añadir una sección nueva a la
// "memoria" de La Doctora, basta con añadir una entrada aquí.
export const SECCIONES: SeccionClinica[] = [
  {
    label: 'Diagnóstico',
    ruta: '/dashboard/diagnostico',
    descripcion:
      'Test de nivel propio (gramática, comprensión auditiva, comprensión lectora y expresión escrita) que calcula su nivel MCER y crea su plan de tratamiento. Si pregunta cuál es su nivel o cómo saberlo, dile que lo descubra aquí; NO le mandes a Instituto Cervantes, DELE u otras webs externas.',
  },
  {
    label: 'Farmacias',
    ruta: '/dashboard/farmacias',
    descripcion:
      'Recursos de aprendizaje organizados por categorías ("medicación"): píldoras gramaticales, jarabes de vocabulario, cápsulas culturales, etc. Cada recurso se lee en la app y se puede descargar en PDF. Muchos textos traen léxico con definiciones y enlace a la RAE.',
  },
  {
    label: 'Rutas culturales',
    ruta: '/dashboard/rutas',
    descripcion:
      'Rutas a pie por Granada con mapa interactivo; cada parada trae su léxico y expresiones útiles. ES LA SECCIÓN A RECOMENDAR cuando el paciente pida recorridos, paseos o rutas por la ciudad (no le mandes a Actividades para eso).',
  },
  {
    label: 'Actividades',
    ruta: '/dashboard/actividades',
    descripcion:
      'Agenda de actividades culturales con plazas reservables y descuento del Seguro LC (cine, visitas, encuentros…). Para rutas/paseos por la ciudad, usa mejor la sección Rutas culturales.',
  },
  {
    label: 'Seguro LC',
    ruta: '/dashboard/seguro-lc',
    descripcion: 'Carnet del estudiante con descuentos y acceso a sesiones de mentoría.',
  },
  {
    label: 'Enfermería LC',
    ruta: '/dashboard/enfermeria-lc',
    descripcion: 'Parejas lingüísticas y mentoría con personas locales (de la UGR u otra gente de Granada).',
  },
  {
    label: 'Laboratorio de cine',
    ruta: '/dashboard/laboratorio-cine',
    descripcion: 'Cine español para entrenar el oído, recomendado por niveles.',
  },
  {
    label: 'Escuela de Poetas',
    ruta: '/dashboard/escuela-poetas',
    descripcion: 'Taller de escritura creativa y poesía.',
  },
  {
    label: 'Tutoría',
    ruta: '/dashboard/tutoria',
    descripcion:
      'Reserva de sesiones: mentoría con gente local (incluida en el Seguro LC) y tutoría con profesorado para alumnos matriculados (2 mensual / 8 trimestral).',
  },
  {
    label: 'Portafolio',
    ruta: '/dashboard/portafolio',
    descripcion: 'Registro del progreso y de los trabajos del paciente.',
  },
  {
    label: 'La Doctora (Emergencia IA)',
    ruta: '/dashboard/emergencia',
    descripcion: 'Esta misma línea de chat contigo, para dudas y práctica.',
  },
];

const CATEGORIA_LABEL: Record<CategoriaFarmacia, string> = {
  grammar: 'Gramática',
  vocabulary: 'Vocabulario',
  cultural: 'Cultura',
  conversation: 'Conversación',
  writing: 'Escritura',
  audiovisual: 'Audiovisual',
};

/**
 * Genera el resumen de la Clínica que se inyecta en el prompt de La Doctora.
 * Incluye datos EN VIVO de las rutas (lib/rutas.ts) y de los recursos de las
 * farmacias (lib/recursos.ts), de modo que el prompt nunca se queda obsoleto.
 */
export function resumenClinica(): string {
  const secciones = SECCIONES.map((s) => `- ${s.label} (${s.ruta}): ${s.descripcion}`).join('\n');

  const rutas = RUTAS.map(
    (r) => `  · ${r.titulo} — ${r.subtitulo} (nivel ${r.nivel}, ${r.duracion}, ${r.paradas.length} paradas)`
  ).join('\n');

  const farmacias = (Object.keys(RECURSOS_POR_CATEGORIA) as CategoriaFarmacia[])
    .map((c) => {
      const titulos = RECURSOS_POR_CATEGORIA[c].map((r) => `${r.titulo} (${r.nivel})`).join('; ');
      return `  · ${CATEGORIA_LABEL[c]}: ${titulos}`;
    })
    .join('\n');

  return `SECCIONES DEL PANEL DEL PACIENTE (recomiéndalas SIEMPRE con enlace markdown y su ruta interna; nunca inventes URLs):
${secciones}

RUTAS CULTURALES disponibles ahora mismo en /dashboard/rutas:
${rutas}

RECURSOS DE LAS FARMACIAS disponibles ahora mismo en /dashboard/farmacias:
${farmacias}`;
}
