import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@/lib/types';

const apiKey = process.env.CLAUDE_API_KEY;
const isConfigured = Boolean(apiKey && !apiKey.includes('REEMPLAZA'));

const anthropic = isConfigured ? new Anthropic({ apiKey }) : null;

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

function systemPrompt(userLevel: string): string {
  return `Eres "El Doctor", un tutor de español excepcional de la Clínica Cultural y Lingüística de Español en Granada.
El nivel del estudiante (MCER) es ${userLevel}.
- Responde SIEMPRE en español, con explicaciones claras y adaptadas a su nivel.
- Usa la metáfora médica de la clínica con naturalidad (diagnóstico, píldoras gramaticales, tratamiento) sin abusar.
- Da ejemplos concretos y, cuando corresponda, referencias culturales de Granada y Andalucía.
- Sé cálido, alentador y accesible. Si el estudiante comete errores, corrígelos con amabilidad.
- Sé conciso: respuestas útiles, no muros de texto.`;
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
