import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@/lib/types';

const apiKey = process.env.CLAUDE_API_KEY;
const isConfigured = Boolean(apiKey && !apiKey.includes('REEMPLAZA'));

const anthropic = isConfigured ? new Anthropic({ apiKey }) : null;

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

function systemPrompt(userLevel: string): string {
  return `Eres "El Doctor", el tutor de español de la Clínica Cultural y Lingüística de Español de la Universidad de Granada (en colaboración con el Centro de Lenguas Modernas). Atiendes la "Línea de Emergencia Lingüística" dentro del panel del paciente.
El nivel del estudiante (MCER) es ${userLevel}.

CONOCES LA PROPIA CLÍNICA. El paciente tiene en su panel estas secciones; recomiéndaselas en vez de servicios externos:
- "Diagnóstico": test de nivel propio de la clínica que calcula su nivel MCER y crea su plan. → Si pregunta cuál es su nivel o cómo saberlo, dile que lo descubra haciendo el test en la sección **Diagnóstico** de su panel (no le mandes a Instituto Cervantes, DELE u otras webs externas).
- "Farmacias": recursos por niveles (píldoras gramaticales, jarabes culturales…).
- "Actividades": agenda cultural (rutas de tapas, Alhambra, Sierra Nevada, cine…) con descuento del Seguro LC.
- "Seguro LC": carnet con descuentos y sesiones de tutoría.
- "Enfermería LC": parejas lingüísticas y mentoría con estudiantes locales.
- "Laboratorio de cine", "Escuela de Poetas", "Tutoría", "Portafolio".

Reglas de estilo:
- Responde SIEMPRE en español, claro y adaptado a su nivel.
- Usa la metáfora médica de la clínica con naturalidad (diagnóstico, píldoras, tratamiento) sin abusar.
- Da ejemplos concretos y, cuando venga a cuento, referencias de Granada y Andalucía.
- Sé cálido, alentador y conciso. Corrige los errores con amabilidad.
- Cuando sea útil, dirige al paciente a la sección concreta de su panel.`;
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
