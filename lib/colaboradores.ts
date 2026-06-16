// Entidades colaboradoras de la Clínica. Para añadir, cambiar o quitar una
// entidad, edita esta lista (opcionalmente con su logo en /public/imgs/logos).

export interface Colaborador {
  nombre: string;
  tipo: string; // rol o categoría de la colaboración
  url?: string; // web de la entidad (opcional)
  logo?: string; // ruta del logo en /public (opcional)
}

export const COLABORADORES: Colaborador[] = [
  {
    nombre: 'Universidad de Granada',
    tipo: 'Institución promotora',
    url: 'https://www.ugr.es',
  },
  {
    nombre: 'Centro de Lenguas Modernas',
    tipo: 'Colaborador académico',
    url: 'https://clm-granada.com',
  },
  {
    nombre: 'Espacio V Centenario · UGR',
    tipo: 'Sede y difusión cultural',
  },
];

/** Iniciales para el monograma cuando la entidad no tiene logo. */
export function inicialesColaborador(nombre: string): string {
  const stop = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'i']);
  return nombre
    .replace(/·.*$/, '') // ignora lo que va tras "·"
    .split(/\s+/)
    .filter((w) => w && !stop.has(w.toLowerCase()))
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
