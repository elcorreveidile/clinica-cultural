// Retos de escritura creativa de la Escuela de Poetas. Cada reto explica una
// forma poética sencilla con instrucciones y un ejemplo (en markdown).

export interface RetoPoetico {
  id: string;
  titulo: string;
  icono: string;
  forma: string; // nombre de la forma poética
  nivel: string; // MCER orientativo
  descripcion: string;
  instrucciones: string; // markdown
  ejemplo: string; // markdown
}

export const RETOS: RetoPoetico[] = [
  {
    id: 'acrostico',
    titulo: 'Acróstico de Granada',
    icono: '🔡',
    forma: 'Acróstico',
    nivel: 'A1',
    descripcion: 'Un poema donde las iniciales de cada verso forman una palabra.',
    instrucciones: `Escribe un poema en el que la **primera letra de cada verso**, leída de arriba abajo, forme una palabra. Empieza por algo fácil: **GRANADA** o tu propio nombre.

- Una palabra = una letra por verso.
- No te preocupes por la rima; cuida el sentido y las imágenes.`,
    ejemplo: `**G**ranada de mil colores,
**R**íos que bajan cantando,
**A**lhambra que está soñando,
**N**oches llenas de rumores,
**A**romas y mil olores,
**D**ulces tardes de verano,
**A**ndalucía en mi mano.`,
  },
  {
    id: 'haiku',
    titulo: 'Haiku de las estaciones',
    icono: '🍃',
    forma: 'Haiku',
    nivel: 'A2',
    descripcion: 'Tres versos (5-7-5 sílabas) que capturan un instante de la naturaleza.',
    instrucciones: `El haiku es un poema japonés de **tres versos** sin rima, con esta medida de sílabas:

1. Primer verso: **5 sílabas**
2. Segundo verso: **7 sílabas**
3. Tercer verso: **5 sílabas**

Habla de la **naturaleza** o de una **estación**, y busca una pequeña sorpresa al final.`,
    ejemplo: `La nieve cae *(5)*
sobre Sierra Nevada *(7)*
duerme el silencio. *(5)*`,
  },
  {
    id: 'gregueria',
    titulo: 'Greguería',
    icono: '💡',
    forma: 'Greguería',
    nivel: 'B1',
    descripcion: 'Una sola frase que une humor y metáfora (al estilo de Ramón Gómez de la Serna).',
    instrucciones: `Una **greguería** es una frase breve e ingeniosa que mira el mundo de forma original: **metáfora + humor**.

- Escribe **una sola línea**.
- Mira un objeto cotidiano y di qué te parece.
- Fórmula útil: *"X es / parece …"*.`,
    ejemplo: `> El café es un líquido negro que nos quita el sueño de los ojos.

> Los ceros son los huevos de los que nacieron las demás cifras.`,
  },
  {
    id: 'caligrama',
    titulo: 'Caligrama',
    icono: '🎨',
    forma: 'Caligrama',
    nivel: 'A2',
    descripcion: 'Un poema cuya disposición dibuja la forma de aquello que nombra.',
    instrucciones: `Un **caligrama** es un poema que se **dibuja**: las palabras se colocan formando la silueta de lo que describen (una luna, una guitarra, una montaña…).

- Elige un objeto con forma reconocible.
- Escribe frases cortas y colócalas formando ese dibujo.
- Aquí puedes escribirlo con espacios y saltos de línea para dar la forma.`,
    ejemplo: `\`\`\`
        L U N A
      llena   de
     plata sobre
      el  Albaicín
        que    brilla
          en  la
            noche
\`\`\``,
  },
  {
    id: 'romance',
    titulo: 'Romance granadino',
    icono: '🎶',
    forma: 'Romance',
    nivel: 'B2',
    descripcion: 'La forma más española: versos de ocho sílabas con rima asonante en los pares.',
    instrucciones: `El **romance** es una forma tradicional española:

- Versos de **ocho sílabas** (octosílabos).
- **Rima asonante** (solo las vocales) en los versos **pares**; los impares quedan libres.
- Tono narrativo: cuenta una pequeña historia o escena de Granada.`,
    ejemplo: `Por las calles del Albaicín
sube la luna de plata,
y en cada esquina encalada
se enreda una serenata.`,
  },
];

export function retoPorId(id: string | null | undefined): RetoPoetico | undefined {
  if (!id) return undefined;
  return RETOS.find((r) => r.id === id);
}
