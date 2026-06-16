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

Cuando hoy subimos a la **Alhambra**, no visitamos un simple castillo, sino lo que un día fue una **ciudad palatina** completa: el centro del poder del **Reino Nazarí de Granada**, el último reino musulmán que existió en la península ibérica. Para entenderla, hay que viajar a los siglos **XIII, XIV y XV**.

### Un reino entre dos mundos

A principios del siglo XIII, el poder musulmán en la península se estaba debilitando. En **1238**, **Mohammed I**, conocido como *Alhamar*, fundó la **dinastía nazarí** y eligió la colina de la Sabika, sobre Granada, para construir su residencia y su fortaleza. Durante más de **250 años**, los reyes nazaríes lograron mantener su reino mientras a su alrededor avanzaban los reinos cristianos.

La Alhambra que tanto admiramos no se levantó de golpe. Fue creciendo con cada sultán. Los grandes **palacios** que hoy visitamos son obra sobre todo de **Yusuf I** y de su hijo **Mohammed V**, en pleno siglo XIV, el momento de mayor esplendor del reino.

### El "castillo rojo"

El nombre *Alhambra* viene del árabe **al-qal'a al-hamra**, que significa **"el castillo rojo"**. Hay varias explicaciones: unos dicen que es por el color rojizo de la tierra y de los muros, que al **atardecer** parecen arder; otros, que las obras se hacían de noche, a la luz de antorchas, y desde la ciudad se veía un resplandor rojo.

### El final de un reino

En **1492**, los **Reyes Católicos** entraron en Granada y el último sultán, **Boabdil**, entregó las llaves de la ciudad. Así terminó casi ocho siglos de presencia musulmana en la península. Años más tarde, el emperador **Carlos V** mandó construir, dentro del recinto, un gran **palacio renacentista** de planta cuadrada y patio circular, que aún hoy contrasta con la delicadeza nazarí.

📌 **Léxico de la cápsula:** *dinastía, reino, sultán, ciudad palatina, fortaleza, muro, conquista, esplendor, atardecer, recinto.*

💬 **Expresión útil:** "remontarse a" → *La historia de la Alhambra se remonta al siglo XIII.*

> 🧠 **Mini‑reto:** Explica en dos frases qué significa "Alhambra" y por qué fue tan importante el año 1492.`,
    },
    {
      id: 'alhambra-espacios',
      titulo: 'Cápsula 2 · Un paseo por sus espacios',
      tipo: 'jarabe',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 7,
      descripcion: 'Las cuatro zonas que no te puedes perder.',
      contenido: `## Un paseo por la Alhambra

La Alhambra no es un único edificio, sino un conjunto enorme rodeado de **murallas y torres**. Para no perderse, conviene conocer sus **cuatro grandes zonas**. Imagina que entramos a pasear.

### 1. La Alcazaba

Es la parte **militar** y la más **antigua** del recinto. Aquí vivían los soldados que vigilaban la ciudad. Su punto más famoso es la **Torre de la Vela**: desde lo alto se obtiene una de las mejores **vistas panorámicas** de Granada, con el barrio del **Albaicín** enfrente y, al fondo, **Sierra Nevada**. Cuenta la tradición que quien hace sonar su campana encontrará pareja antes de un año.

### 2. Los Palacios Nazaríes

Son el **corazón** y la joya del conjunto. Aquí vivían y gobernaban los sultanes. Se recorren varias **salas** y patios encadenados:

- El **Patio de los Arrayanes**, con su gran **alberca** rodeada de setos de arrayán.
- El célebre **Patio de los Leones**, con su fuente sostenida por doce leones de mármol.
- La **Sala de los Embajadores**, donde el sultán recibía a las visitas importantes.

⏱️ Importante: la entrada a esta zona tiene **hora exacta**; si llegas tarde, puedes quedarte fuera.

### 3. El Generalife

Era la **almunia**, es decir, la finca de **recreo** y las huertas de los sultanes, un poco apartada para descansar. Destacan sus **jardines**, sus **fuentes** y el famoso **Patio de la Acequia**, lleno de surtidores de agua.

### 4. El Palacio de Carlos V

El más reciente y diferente: un **palacio renacentista** del siglo XVI, de planta cuadrada por fuera y con un sorprendente **patio circular** por dentro. Hoy alberga dos museos.

📌 **Léxico de la cápsula:** *recinto, muralla, torre, sala, patio, alberca, jardín, fuente, mirador, vistas.*

💬 **Expresión útil:** "merecer la pena" → *Subir a la Torre de la Vela merece la pena por las vistas.*

> 🧠 **Mini‑reto:** Si solo tuvieras una hora, ¿qué dos zonas elegirías y por qué?`,
    },
    {
      id: 'alhambra-agua',
      titulo: 'Cápsula 3 · El agua, alma del palacio',
      tipo: 'pomada',
      formato: 'texto',
      nivel: 'B1',
      duracionMin: 7,
      descripcion: 'Por qué el agua está en todas partes.',
      contenido: `## El agua, alma del palacio

Si cierras los ojos en la Alhambra, lo primero que oirás será el **agua**. No es casualidad: para la cultura **andalusí**, el agua simbolizaba la **vida**, la **purificación** y el **paraíso**. Por eso el palacio está pensado para que el agua corra, se refleje y suene por todas partes.

### Traer el agua a la colina

La Alhambra está en lo alto de una colina, así que llevar agua hasta allí fue un reto de **ingeniería**. Los nazaríes construyeron la **Acequia Real**, un canal que tomaba el agua del río **Darro**, varios kilómetros más arriba, y la conducía por gravedad hasta el recinto. De ahí pasaba a **albercas, fuentes y baños**.

### Agua para ver, oír y refrescar

El agua tiene en la Alhambra tres funciones que se mezclan:

- **Estética:** la gran **alberca** del Patio de los Arrayanes funciona como un espejo que **refleja** la fachada y el cielo.
- **Sonora:** los **surtidores** y caños crean un sonido constante y relajante.
- **Climática:** las fuentes y los patios **refrescan** el ambiente en los calurosos veranos de Granada.

La **Fuente de los Leones**, del siglo XIV, era además una pequeña maravilla técnica: gracias a un sistema de canales, marcaba de algún modo el paso de las horas, casi como un **reloj de agua**.

### En el Generalife

En los jardines del **Generalife**, el **Patio de la Acequia** lleva el juego del agua al extremo: dos hileras de **surtidores** cruzan sus chorros sobre un canal central. Es uno de los rincones más fotografiados del mundo.

📌 **Léxico de la cápsula:** *agua, acequia, alberca, fuente, surtidor, caño, caudal, reflejo, refrescar, regar.*

💬 **Expresión útil:** "estar pensado para" → *Todo el palacio está pensado para disfrutar del agua.*

> 🧠 **Mini‑reto:** Nombra las tres funciones del agua en la Alhambra y pon un ejemplo de cada una.`,
    },
    {
      id: 'alhambra-arte',
      titulo: 'Cápsula 4 · El arte nazarí',
      tipo: 'pildora',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 8,
      descripcion: 'Yeserías, alicatados y mocárabes: aprende a mirarlos.',
      contenido: `## Aprender a mirar el arte nazarí

La primera vez que se entra en los Palacios Nazaríes, la decoración **abruma**: no hay un solo muro vacío. Pero si aprendes a reconocer **tres técnicas**, empezarás a "leer" las paredes como un experto.

Una idea clave: el arte nazarí casi **nunca representa figuras humanas o animales**. En su lugar, juega con la **geometría**, la **vegetación** estilizada y la **escritura**.

### 1. Las yeserías

Son relieves hechos en **yeso**, un material barato y fácil de tallar. Con él se cubrían los muros de motivos finísimos. Hay dos tipos principales:

- El **ataurique**: decoración **vegetal** (hojas, tallos, palmas) muy estilizada.
- Los **motivos geométricos** y la **caligrafía**, que veremos en otra cápsula.

### 2. Los alicatados

En la parte baja de los muros encontramos los **alicatados**: **mosaicos** de pequeños **azulejos** de colores (los *aliceres*) cortados a mano y combinados para formar **estrellas** y patrones que se repiten hasta el infinito. Son la base de las famosas "teselas" que tanto estudian los matemáticos por su simetría.

### 3. Los mocárabes

Mira hacia arriba en la **Sala de los Abencerrajes** o de las **Dos Hermanas**: verás unas **bóvedas** cubiertas de pequeñas piezas que cuelgan como **estalactitas**. Son los **mocárabes**, prismas de yeso combinados para crear cúpulas que parecen de **encaje** y que difunden la luz de forma mágica.

### La idea de fondo

Las tres técnicas comparten un principio: la **repetición** y la **simetría**. Para la cultura andalusí, esos patrones infinitos eran una forma de representar la **perfección** y lo eterno.

📌 **Léxico de la cápsula:** *yeso, yesería, ataurique, azulejo, alicatado, mosaico, bóveda, mocárabe, relieve, motivo, simetría.*

💬 **Expresión útil:** "fijarse en" → *Fíjate en las bóvedas: están llenas de mocárabes.*

> 🧠 **Mini‑reto:** Explica con tus palabras la diferencia entre una **yesería** y un **alicatado**.`,
    },
    {
      id: 'alhambra-lema',
      titulo: 'Cápsula 5 · El lema y las leyendas',
      tipo: 'jarabe',
      formato: 'texto',
      nivel: 'B2',
      duracionMin: 7,
      descripcion: 'La frase escrita en los muros y los cuentos que inspiró.',
      contenido: `## Palabras en los muros y leyendas

En la Alhambra, las paredes **hablan**. Entre la decoración geométrica y vegetal aparece, una y otra vez, la **escritura árabe**. No es solo adorno: muchas inscripciones son **poemas** y **frases** con significado.

### El lema nazarí

La frase que más se repite es el **lema** de la dinastía: **"Wa la galib illa Allah"**, que se traduce como **"Y no hay vencedor sino Dios"** (o *"Solo Dios es vencedor"*). Cuenta la tradición que Mohammed I la pronunció al volver de una batalla, cuando la gente lo aclamaba como vencedor, y que él quiso recordar con humildad que la victoria no era suya. Desde entonces, esa frase decora cientos de muros.

La **caligrafía** árabe es, por tanto, las dos cosas a la vez: **arte** que decora y **mensaje** que comunica. En las salas también hay poemas que "hablan en primera persona", como si fuera el propio palacio quien se describe al visitante.

### Las leyendas y Washington Irving

La Alhambra estuvo siglos algo **abandonada**. Su fama mundial actual se debe, en parte, a un escritor **estadounidense**: **Washington Irving**. En **1829** vivió varias semanas en sus salas casi vacías y, fascinado, escribió los *Cuentos de la Alhambra* (**1832**), un libro de **leyendas** y relatos románticos que dio la vuelta al mundo.

Gracias a esos cuentos, llenos de princesas, tesoros escondidos y soldados encantados, miles de viajeros empezaron a llegar a Granada. Hoy una placa recuerda las habitaciones donde se alojó el escritor.

📌 **Léxico de la cápsula:** *lema, inscripción, caligrafía, poema, leyenda, cuento, escritor, alojarse, fascinar, abandonado.*

💬 **Expresión útil:** "deberse a" → *La fama de la Alhambra se debe en parte a Washington Irving.*

> 🧠 **Mini‑reto:** ¿Qué quiere decir el lema nazarí y por qué fue importante el libro de Washington Irving?`,
    },
    {
      id: 'alhambra-visita',
      titulo: 'Cápsula 6 · Inyección práctica: tu visita',
      tipo: 'inyeccion',
      formato: 'interactivo',
      nivel: 'A2',
      duracionMin: 6,
      descripcion: 'Frases y vocabulario para visitar la Alhambra sin problemas.',
      contenido: `## Tu visita a la Alhambra, paso a paso

Esta cápsula es práctica: te prepara para **visitar la Alhambra hablando español**. Léela antes de ir.

### Antes de ir

Las entradas **se agotan** semanas antes, sobre todo en primavera y verano. Recomendaciones:

- **Compra la entrada con antelación** por internet.
- Lleva tu **DNI o pasaporte**: a veces lo piden al entrar.
- La entrada a los **Palacios Nazaríes** tiene una **hora exacta**. Llega con tiempo, porque si te retrasas, **pierdes el turno**.

### En la taquilla o el acceso

- *"Buenos días, **tengo una reserva** a nombre de…"*
- *"¿Me podría decir **dónde está la entrada** a los Palacios Nazaríes?"*
- *"¿**Hay descuento** para estudiantes?"*

### Durante la visita

- *"Perdone, ¿**por dónde se va** a la Alcazaba?"*
- *"¿**A qué hora cierra** el Generalife?"*
- *"¿**Se pueden hacer** fotos aquí?"*
- *"¿**Está incluido** el Generalife en esta entrada?"*

### Si te pierdes

- *"Disculpe, **me he perdido**. ¿Esto es la salida?"*
- *"¿**Queda muy lejos** la Torre de la Vela?"*

📌 **Léxico de la cápsula:** *entrada, reserva, taquilla, turno, horario, descuento, visita guiada, audioguía, recorrido, salida.*

💬 **Gramática útil:** las preguntas con **se** impersonal → *¿Por dónde **se va**? · ¿**Se puede** entrar?*

> 👉 **Reto oral:** practica estas frases en voz alta con **La Doctora** en la [Línea de Emergencia](/dashboard/emergencia). Pídele que te corrija la pronunciación.`,
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
