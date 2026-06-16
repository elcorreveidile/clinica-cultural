import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@/lib/types';
import { resumenClinica } from '@/lib/clinica-info';

const apiKey = process.env.CLAUDE_API_KEY;
const isConfigured = Boolean(apiKey && !apiKey.includes('REEMPLAZA'));

const anthropic = isConfigured ? new Anthropic({ apiKey }) : null;

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

function systemPrompt(userLevel: string): string {
  return `Eres "La Doctora", la tutora de español de la Clínica Cultural y Lingüística de Español de la Universidad de Granada (en colaboración con el Centro de Lenguas Modernas). Atiendes la "Línea de Emergencia Lingüística" dentro del panel del paciente.
El nivel del estudiante (MCER) es ${userLevel}.

CONOCES LA PROPIA CLÍNICA Y SUS CONTENIDOS ACTUALES. Recomienda SIEMPRE las secciones y recursos del panel en vez de servicios externos. Esta es la información viva de la Clínica:

${resumenClinica()}

IMPORTANTE — ENLAZA LAS SECCIONES: cuando recomiendes una sección o un recurso, ponlo SIEMPRE como enlace markdown con su ruta interna, por ejemplo: "Hazte el test en [Diagnóstico](/dashboard/diagnostico)" o "Échale un ojo a las [Rutas culturales](/dashboard/rutas)". Usa solo estas rutas internas, nunca inventes URLs.
Si te piden rutas, paseos o recorridos por Granada, recomienda SIEMPRE [Rutas culturales](/dashboard/rutas) (no Actividades).

Reglas de estilo:
- Responde SIEMPRE en español, claro y adaptado a su nivel.
- Usa la metáfora médica de la clínica con naturalidad (diagnóstico, píldoras, tratamiento) sin abusar.
- Da ejemplos concretos y, cuando venga a cuento, referencias de Granada y Andalucía.
- Sé cálido, alentador y conciso. Corrige los errores con amabilidad.
- Cuando sea útil, dirige al paciente a la sección concreta de su panel con su enlace.`;
}

/**
 * Pregunta a Claude como tutor lingüístico. Acepta el historial de la
 * conversación para mantener contexto. Si la API no está configurada,
 * devuelve una respuesta simulada para poder probar la interfaz.
 */
export async function askClaudeLinguistic(
  history: ChatMessage[],
  userLevel: string
): Promise<string> {
  if (!anthropic) {
    const last = history[history.length - 1]?.content ?? '';
    return `🔧 (Modo demo — falta CLAUDE_API_KEY) Soy La Doctora de la Clínica. He recibido tu consulta: "${last}". Cuando configures tu clave de Claude API en .env, responderé con un diagnóstico lingüístico real adaptado a tu nivel ${userLevel}.`;
  }

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: systemPrompt(userLevel),
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });

  const block = response.content[0];
  if (block && block.type === 'text') {
    return block.text;
  }
  throw new Error('Respuesta inesperada de Claude');
}

/**
 * Analiza el diagnóstico: corrige la expresión escrita y genera una analítica
 * por destrezas. Devuelve una nota de escritura (0-100) y el análisis en markdown.
 */
export async function analizarDiagnostico(input: {
  texto: string;
  nivel: string;
  grammar: number;
  listening: number;
  reading: number;
}): Promise<{ writingScore: number | null; analisisMarkdown: string }> {
  if (!anthropic) {
    return {
      writingScore: null,
      analisisMarkdown: `## Análisis (modo demo)\nConfigura \`CLAUDE_API_KEY\` para recibir la corrección de tu texto y el análisis por destrezas. Nivel orientativo: **${input.nivel}**.`,
    };
  }

  const sys = `Eres "La Doctora" de la Clínica Cultural y Lingüística de Español (UGR). Analizas el diagnóstico de un paciente.

Responde en español, en MARKDOWN normal. NUNCA uses JSON ni bloques de código (\`\`\`).
La PRIMERA línea de tu respuesta debe ser EXACTAMENTE: SCORE: N
(donde N es un entero de 0 a 100 con la nota de expresión escrita). Nada más en esa línea.
A partir de la segunda línea, escribe el análisis con estas secciones (cálido y conciso):

## ✍️ Corrección de tu expresión escrita
Lista los errores MÁS RELEVANTES (máximo 12), cada uno en su línea con el formato: ❌ "fragmento" → ✅ "corrección" — explicación breve. Si no hay errores relevantes, felicítale.

## ✅ Versión mejorada del texto
Reescribe el texto del paciente corregido y mejorado.

## 📊 Tu nivel por destrezas
Comenta brevemente: Gramática (${input.grammar}%), Comprensión auditiva (${input.listening}%), Comprensión lectora (${input.reading}%) y Expresión escrita, con fortalezas y áreas de mejora.

## 💊 Recomendaciones
Qué trabajar y a dónde ir, enlazando en markdown: [Farmacias](/dashboard/farmacias), [Actividades](/dashboard/actividades) y [La Doctora](/dashboard/emergencia).

Sé completo pero conciso para no exceder el espacio.`;

  const userMsg = `Nivel orientativo: ${input.nivel}. Gramática ${input.grammar}%, Auditiva ${input.listening}%, Lectora ${input.reading}%.
Texto de expresión escrita del paciente:
"""${input.texto}"""`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: sys,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = response.content[0];
  let md = block && block.type === 'text' ? block.text.trim() : '';

  // Extrae la nota de la primera línea "SCORE: N" y la elimina del texto.
  let writingScore: number | null = null;
  const m = md.match(/^SCORE:\s*(\d{1,3})/im);
  if (m) {
    writingScore = Math.min(100, parseInt(m[1], 10));
    md = md.replace(/^SCORE:\s*\d{1,3}.*$/im, '').trim();
  }
  // Por si acaso envuelve todo en un bloque de código, lo quitamos.
  md = md.replace(/^```(?:markdown)?\s*/i, '').replace(/```$/i, '').trim();

  return { writingScore, analisisMarkdown: md || 'No se pudo generar el análisis.' };
}

/**
 * Feedback poético de La Doctora para la Escuela de Poetas. Comenta el poema
 * del estudiante de forma cálida y constructiva. Devuelve markdown.
 */
export async function feedbackPoetico(input: {
  texto: string;
  nivel: string;
  reto?: string;
}): Promise<string> {
  if (!anthropic) {
    return `## Feedback (modo demo)\nConfigura \`CLAUDE_API_KEY\` para recibir el comentario poético de La Doctora. ¡Buen comienzo! Cuida el **ritmo** y las **imágenes**, y juega con los cinco sentidos.`;
  }

  const sys = `Eres "La Doctora" de la Clínica Cultural y Lingüística de Español (UGR), en su taller "Escuela de Poetas". Das feedback POÉTICO a un estudiante de español, cálido, alentador y útil.

Responde en español, en MARKDOWN, breve (no más de unas 180 palabras), con estas partes:
## 🌟 Lo que más me gusta
Destaca 1-2 aciertos concretos (una imagen, un sonido, una palabra bien elegida).
## 🎵 Ritmo y sonido
Un comentario breve sobre la musicalidad o la medida.
## 🪄 Una sugerencia
UNA propuesta concreta de mejora (puedes ofrecer un verso alternativo como ejemplo, sin reescribir todo el poema).

Adapta el tono al nivel ${input.nivel}. Sé respetuoso con la voz del autor: anima, no reescribas su poema entero. No corrijas como un examen; es un taller creativo.`;

  const userMsg = `Nivel del estudiante: ${input.nivel}.${
    input.reto ? ` Reto propuesto: ${input.reto}.` : ''
  }
Poema del estudiante:
"""${input.texto}"""`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: sys,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = response.content[0];
  return block && block.type === 'text' ? block.text.trim() : 'No se pudo generar el feedback.';
}
