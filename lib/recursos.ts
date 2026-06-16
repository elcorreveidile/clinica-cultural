// Catálogo de recursos ("medicación") de las Farmacias lingüísticas.
// Indexado por la categoría de la farmacia (coincide con el enum de la BD).
// El contenido es markdown, así que se renderiza con formato.

export type CategoriaFarmacia =
  | 'grammar'
  | 'vocabulary'
  | 'cultural'
  | 'conversation'
  | 'writing'
  | 'audiovisual';

export type TipoDosis = 'pildora' | 'jarabe' | 'pomada' | 'inyeccion';
export type Formato = 'texto' | 'ejercicio' | 'video' | 'audio' | 'interactivo';

export interface Recurso {
  id: string;
  titulo: string;
  tipo: TipoDosis;
  formato: Formato;
  nivel: string;
  duracionMin: number;
  descripcion: string;
  contenido: string; // markdown
  url?: string; // recurso externo opcional
}

export const DOSIS: Record<TipoDosis, { label: string; icon: string }> = {
  pildora: { label: 'Píldora', icon: '💊' },
  jarabe: { label: 'Jarabe', icon: '🧴' },
  pomada: { label: 'Pomada', icon: '🧪' },
  inyeccion: { label: 'Inyección', icon: '💉' },
};

export const FORMATO_LABEL: Record<Formato, string> = {
  texto: 'Lectura',
  ejercicio: 'Ejercicio',
  video: 'Vídeo',
  audio: 'Audio',
  interactivo: 'Interactivo',
};

export const RECURSOS_POR_CATEGORIA: Record<CategoriaFarmacia, Recurso[]> = {
  grammar: [
    {
      id: 'subjuntivo-presente',
      titulo: 'Píldora: el presente de subjuntivo',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 8,
      descripcion: 'Cuándo y cómo usar el subjuntivo en presente.',
      contenido: `## El presente de subjuntivo

Usamos el subjuntivo para expresar **deseos, dudas, emociones y valoraciones**.

- **Deseo:** Quiero que **vengas** a la fiesta.
- **Duda / negación:** No creo que **sea** verdad.
- **Emoción:** Me alegra que **estés** aquí.
- **Valoración:** Es importante que **practiques** cada día.

**Truco:** muchas veces aparece tras *que* cuando hay dos sujetos distintos:
*Espero (yo) que tú **apruebes**.*

> Mini‑reto: transforma "Es necesario (tú / descansar)" → *Es necesario que descanses.*`,
    },
    {
      id: 'ser-estar',
      titulo: 'Ser vs. Estar sin errores',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'A2',
      duracionMin: 6,
      descripcion: 'La diferencia que más cuesta, explicada fácil.',
      contenido: `## Ser vs. Estar

- **SER** → identidad, características permanentes, hora y origen.
  - *Soy profesora.* / *Es de Granada.* / *Son las tres.*
- **ESTAR** → estados, ubicación y resultados temporales.
  - *Estoy cansado.* / *Granada está en Andalucía.* / *La sopa está fría.*

⚠️ ¡Ojo! Cambian el significado:
- *Es aburrido* (su carácter) ≠ *Está aburrido* (ahora mismo).`,
    },
    {
      id: 'por-para',
      titulo: 'Ejercicio: por y para',
      tipo: 'jarabe',
      formato: 'ejercicio',
      nivel: 'B1',
      duracionMin: 10,
      descripcion: 'Practica la eterna duda entre "por" y "para".',
      contenido: `## Por y para — practica

Completa mentalmente con **por** o **para**:

1. Estudio español ___ trabajar en España.
2. Gracias ___ tu ayuda.
3. Este regalo es ___ ti.
4. Pasé ___ el centro de camino a casa.

**Soluciones:** 1) para (finalidad) · 2) por (causa) · 3) para (destinatario) · 4) por (lugar de tránsito).`,
    },
  ],
  vocabulary: [
    {
      id: 'andaluz-basico',
      titulo: 'Jarabe de expresiones andaluzas',
      tipo: 'jarabe',
      formato: 'texto',
      nivel: 'A2',
      duracionMin: 7,
      descripcion: 'Palabras y expresiones que oirás en Granada.',
      contenido: `## Habla como en Graná

- **"¡Qué arte!"** → ¡qué gracia / talento!
- **"Pisha / quillo"** → tío, colega (informal).
- **"Estar regular"** → no estar bien del todo.
- **"Echar un rato"** → pasar el tiempo charlando.
- **"La tapa"** → ración gratis con la bebida (¡muy de Granada!).

> Reto: usa "echar un rato" en una frase sobre tu fin de semana.`,
    },
    {
      id: 'falsos-amigos',
      titulo: 'Píldora: falsos amigos',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 6,
      descripcion: 'Palabras que parecen lo que no son.',
      contenido: `## Falsos amigos frecuentes

- **Embarazada** ≠ *embarrassed* → significa *pregnant*.
- **Éxito** ≠ *exit* → significa *success*.
- **Constipado** ≠ *constipated* → significa *resfriado*.
- **Largo** ≠ *large* → significa *long*.

⚠️ Estos errores son muy típicos; ¡memorízalos!`,
    },
  ],
  cultural: [
    {
      id: 'alhambra-historia',
      titulo: 'Cápsula 1 · Historia: los nazaríes',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 8,
      descripcion: 'Quién construyó la Alhambra y por qué es tan especial.',
      contenido: `## La Alhambra y la dinastía nazarí

La Alhambra fue la **ciudad palatina** del Reino Nazarí de Granada, el último reino musulmán de la península ibérica (siglos **XIII–XV**). La levantaron sobre todo **Yusuf I** y **Mohammed V** en el siglo XIV.

Su nombre viene del árabe *al-qal'a al-hamra*, **"el castillo rojo"**, por el color de sus muros al atardecer.

En **1492**, con la conquista por los Reyes Católicos, terminó el reino nazarí; años después se añadió el **Palacio de Carlos V**, de estilo renacentista.

📌 **Léxico:** *dinastía, reino, palacio, fortaleza, conquista, siglo.*

> 🧠 Mini‑reto: ¿qué significa "Alhambra" y de qué lengua viene?`,
    },
    {
      id: 'alhambra-espacios',
      titulo: 'Cápsula 2 · Un paseo por sus espacios',
      tipo: 'jarabe',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 9,
      descripcion: 'Las cuatro zonas que no te puedes perder.',
      contenido: `## Las cuatro zonas de la Alhambra

1. **La Alcazaba** — la parte militar, la más antigua. Desde la **Torre de la Vela** hay vistas de toda Granada.
2. **Los Palacios Nazaríes** — el corazón del conjunto: el **Patio de los Arrayanes** y el famoso **Patio de los Leones**.
3. **El Generalife** — la *almunia* (finca de recreo) con sus **jardines** y huertas.
4. **El Palacio de Carlos V** — renacentista, con un sorprendente **patio circular**.

📌 **Léxico:** *torre, muralla, patio, jardín, sala, fuente, mirador.*

> 🧠 Mini‑reto: ¿qué zona usarías para defender la ciudad?`,
    },
    {
      id: 'alhambra-agua',
      titulo: 'Cápsula 3 · El agua, alma del palacio',
      tipo: 'pomada',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 7,
      descripcion: 'Por qué el agua está en todas partes.',
      contenido: `## El agua en la Alhambra

Para la cultura andalusí, el agua simbolizaba la **vida** y el **paraíso**. Por eso la Alhambra está llena de **fuentes, albercas y acequias**.

- La **Acequia Real** trae el agua desde el río Darro.
- El **Patio de los Arrayanes** tiene una gran **alberca** que refleja la fachada.
- La **Fuente de los Leones** es todo un reloj de agua del siglo XIV.

🔊 Fíjate en el sonido del agua: forma parte de la experiencia.

📌 **Léxico:** *fuente, alberca, acequia, surtidor, caudal, reflejo.*`,
    },
    {
      id: 'alhambra-arte',
      titulo: 'Cápsula 4 · El arte nazarí',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 8,
      descripcion: 'Yeserías, alicatados y mocárabes: aprende a mirarlos.',
      contenido: `## Cómo mirar la decoración nazarí

La Alhambra no usa figuras humanas, sino tres recursos decorativos:

- **Yeserías:** relieves de yeso con motivos vegetales (*ataurique*) y geométricos.
- **Alicatados:** mosaicos de azulejos de colores formando patrones geométricos.
- **Mocárabes:** esas "estalactitas" de yeso en las bóvedas, como la **Sala de los Abencerrajes**.

Todo se basa en la **repetición** y la **simetría**, símbolo del infinito.

📌 **Léxico:** *yeso, azulejo, bóveda, relieve, motivo, geométrico, simétrico.*

> 🧠 Mini‑reto: describe en una frase la diferencia entre *yesería* y *alicatado*.`,
    },
    {
      id: 'alhambra-lema',
      titulo: 'Cápsula 5 · El lema y las leyendas',
      tipo: 'jarabe',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 7,
      descripcion: 'La frase escrita en los muros y los cuentos que inspiró.',
      contenido: `## "Solo Dios es vencedor"

Por los muros se repite en árabe el lema nazarí: **"Wa la galib illa Allah"** → *"Y no hay vencedor sino Dios"*. La **caligrafía** es, a la vez, decoración y mensaje.

Siglos después, el escritor estadounidense **Washington Irving** vivió en la Alhambra y escribió *Cuentos de la Alhambra* (1832), que llenó el monumento de **leyendas** y lo hizo famoso en todo el mundo.

📌 **Léxico:** *lema, caligrafía, leyenda, cuento, escritor, inspirar.*

> 🧠 Mini‑reto: ¿qué escritor ayudó a hacer mundialmente famosa la Alhambra?`,
    },
    {
      id: 'alhambra-visita',
      titulo: 'Cápsula 6 · Inyección práctica: tu visita',
      tipo: 'inyeccion',
      formato: 'interactivo',
      nivel: 'A2',
      duracionMin: 10,
      descripcion: 'Frases y vocabulario para visitar la Alhambra sin problemas.',
      contenido: `## Sobrevive a tu visita (en español)

**Antes:** las entradas se agotan; **compra con antelación** y lleva tu **DNI o pasaporte**. La entrada a los Palacios Nazaríes tiene **hora exacta**.

**Frases útiles:**
- *"¿Dónde está la entrada a los Palacios Nazaríes?"*
- *"¿A qué hora cierra el Generalife?"*
- *"¿Se puede hacer fotos aquí?"*
- *"Perdone, ¿por dónde se va a la Alcazaba?"*

📌 **Léxico:** *entrada, taquilla, horario, visita guiada, audioguía, recorrido.*

> 👉 Practica estas preguntas en voz alta con **La Doctora** en la [Línea de Emergencia](/dashboard/emergencia).`,
    },
  ],
  conversation: [
    {
      id: 'muletillas',
      titulo: 'Pomada para la fluidez: muletillas',
      tipo: 'pomada',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 6,
      descripcion: 'Gana tiempo y suena más natural.',
      contenido: `## Muletillas para ganar fluidez

Cuando no sabes cómo seguir, usa conectores naturales:

- **"Bueno…"**, **"O sea…"**, **"Es que…"**
- **"A ver…"** (para empezar a pensar en voz alta)
- **"¿Sabes?"**, **"¿no?"** (para buscar complicidad)

⚠️ Sin abusar: una o dos por intervención. ¡Suenan muy nativas!`,
    },
    {
      id: 'medico-roleplay',
      titulo: 'Inyección: simulación en el médico',
      tipo: 'inyeccion',
      formato: 'interactivo',
      nivel: 'B1',
      duracionMin: 12,
      descripcion: 'Prepárate para una situación real.',
      contenido: `## En la consulta del médico

**Vocabulario:** *me duele…, tengo fiebre, estoy mareado, la receta, el justificante.*

Practica este diálogo en voz alta:
- **Médico:** ¿Qué le pasa?
- **Tú:** Me duele la garganta desde hace tres días.
- **Médico:** ¿Tiene fiebre?
- **Tú:** Sí, anoche tenía treinta y ocho y medio.

👉 Luego pregunta a **La Doctora (IA)** en la Línea de Emergencia para practicar más variantes.`,
    },
  ],
  writing: [
    {
      id: 'email-formal',
      titulo: 'Tratamiento: el email formal',
      tipo: 'pomada',
      formato: 'texto',
      nivel: 'C1',
      duracionMin: 10,
      descripcion: 'Estructura y fórmulas de un correo profesional.',
      contenido: `## Escribir un email formal

**Saludo:** *Estimado/a Sr./Sra. [apellido]:*
**Apertura:** *Le escribo en relación con…*
**Cuerpo:** una idea por párrafo, claro y conciso.
**Cierre:** *Quedo a la espera de su respuesta.*
**Despedida:** *Atentamente, [nombre].*

⚠️ Evita el lenguaje coloquial y las abreviaturas.`,
    },
    {
      id: 'conectores',
      titulo: 'Píldora: conectores del discurso',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 7,
      descripcion: 'Da cohesión a tus textos.',
      contenido: `## Conectores imprescindibles

- **Adición:** además, asimismo, por otra parte.
- **Contraste:** sin embargo, no obstante, en cambio.
- **Causa/consecuencia:** debido a, por lo tanto, así pues.
- **Conclusión:** en definitiva, en resumen, para terminar.

> Usa al menos tres conectores distintos en tu próximo texto del diagnóstico.`,
    },
  ],
  audiovisual: [
    {
      id: 'cine-espanol',
      titulo: 'Inyección audiovisual: cine para tu nivel',
      tipo: 'inyeccion',
      formato: 'video',
      nivel: 'B2',
      duracionMin: 15,
      descripcion: 'Películas para entrenar el oído (con subtítulos).',
      contenido: `## Cine español por niveles

- **A2–B1:** *Campeones* (comedia, lenguaje cotidiano).
- **B1–B2:** *Ocho apellidos vascos* (acentos y humor regional).
- **B2–C1:** *Todo sobre mi madre* (Almodóvar, registro rico).

🎧 **Cómo verlas:** primero con subtítulos en español; luego, sin ellos.`,
    },
    {
      id: 'podcast-recomendados',
      titulo: 'Jarabe auditivo: pódcast en español',
      tipo: 'jarabe',
      formato: 'audio',
      nivel: 'B1',
      duracionMin: 10,
      descripcion: 'Para escuchar español real a diario.',
      contenido: `## Pódcast recomendados

- **Notas en español** (B1): conversaciones cotidianas explicadas.
- **Radio Ambulante** (B2–C1): historias reales de Latinoamérica.
- **Hoy Hablamos** (B1–B2): un episodio corto cada día.

💡 Escucha 10 minutos al día y anota 3 palabras nuevas.`,
    },
  ],
};

export function recursosDe(categoria: string | null): Recurso[] {
  if (!categoria) return [];
  return RECURSOS_POR_CATEGORIA[categoria as CategoriaFarmacia] ?? [];
}
