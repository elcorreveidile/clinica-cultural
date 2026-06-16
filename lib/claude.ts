import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@/lib/types';

const apiKey = process.env.CLAUDE_API_KEY;
const isConfigured = Boolean(apiKey && !apiKey.includes('REEMPLAZA'));

const anthropic = isConfigured ? new Anthropic({ apiKey }) : null;

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

function systemPrompt(userLevel: string): string {
  return `Eres "El Doctor", el tutor de español de la Clínica Cultural y Lingüística de Español de la Universidad de Granada (en colaboración con el Centro de Lenguas Modernas). Atiendes la "Línea de Emergencia Lingüística" dentro del panel del paciente.
El nivel del estudiante (MCER) es ${userLevel}.

CONOCES LA PROPIA CLÍNICA. El paciente tiene en su panel estas secciones (con su ruta). Recomiéndaselas en vez de servicios externos:
- Diagnóstico (/dashboard/diagnostico): test de nivel propio que calcula su nivel MCER y crea su plan. → Si pregunta cuál es su nivel o cómo saberlo, dile que lo descubra haciendo el test, y NO le mandes a Instituto Cervantes, DELE u otras webs externas.
- Farmacias (/dashboard/farmacias): recursos por niveles (píldoras gramaticales, jarabes culturales…).
- Actividades (/dashboard/actividades): agenda cultural (rutas de tapas, Alhambra, Sierra Nevada, cine…) con descuento del Seguro LC; se puede reservar plaza.
- Seguro LC (/dashboard/seguro-lc): carnet con descuentos y sesiones de tutoría.
- Enfermería LC (/dashboard/enfermeria-lc): parejas lingüísticas y mentoría con estudiantes locales.
- Laboratorio de cine (/dashboard/laboratorio-cine), Escuela de Poetas (/dashboard/escuela-poetas), Tutoría (/dashboard/tutoria), Portafolio (/dashboard/portafolio).

IMPORTANTE — ENLAZA LAS SECCIONES: cuando recomiendes una sección, ponla SIEMPRE como enlace markdown con su ruta, por ejemplo: "Hazte el test en [Diagnóstico](/dashboard/diagnostico)" o "Échale un ojo a las [Actividades](/dashboard/actividades)". Usa solo estas rutas internas, nunca inventes URLs.

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
    return `🔧 (Modo demo — falta CLAUDE_API_KEY) Soy El Doctor de la Clínica. He recibido tu consulta: "${last}". Cuando configures tu clave de Claude API en .env, responderé con un diagnóstico lingüístico real adaptado a tu nivel ${userLevel}.`;
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

  const sys = `Eres "El Doctor" de la Clínica Cultural y Lingüística de Español (UGR). Analizas el diagnóstico de un paciente.
Responde EXCLUSIVAMENTE con un JSON válido (sin texto fuera del JSON) con esta forma exacta:
{"writingScore": <entero 0-100>, "writingLevel": "<A1|A2|B1|B2|C1|C2>", "analisis": "<markdown en español>"}

El campo "analisis" (markdown, en español, cálido y conciso) debe incluir:
## ✍️ Corrección de tu expresión escrita
Lista los errores reales del texto, uno por línea con el formato: ❌ "fragmento" → ✅ "corrección" — explicación breve. Si no hay errores relevantes, felicítale.
Incluye también una versión mejorada del texto.
## 📊 Tu nivel por destrezas
Comenta brevemente: Gramática (${input.grammar}%), Comprensión auditiva (${input.listening}%), Comprensión lectora (${input.reading}%) y Expresión escrita, con fortalezas y áreas de mejora.
## 💊 Recomendaciones
Qué trabajar y a dónde ir, enlazando en markdown: [Farmacias](/dashboard/farmacias), [Actividades](/dashboard/actividades) y [El Doctor](/dashboard/emergencia).`;

  const userMsg = `Nivel orientativo: ${input.nivel}. Gramática ${input.grammar}%, Auditiva ${input.listening}%, Lectora ${input.reading}%.
Texto de expresión escrita del paciente:
"""${input.texto}"""`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1800,
    system: sys,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = response.content[0];
  const raw = block && block.type === 'text' ? block.text : '';

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const json = JSON.parse(match ? match[0] : raw);
    return {
      writingScore:
        typeof json.writingScore === 'number' ? Math.round(json.writingScore) : null,
      analisisMarkdown: String(json.analisis ?? raw),
    };
  } catch {
    return { writingScore: null, analisisMarkdown: raw || 'No se pudo generar el análisis.' };
  }
}
