// Utilidades varias.

/** Une clases condicionalmente (versión mínima de clsx). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Genera un número de tarjeta Seguro LC con formato LC-AAAA-XXXX-XXXX. */
export function generateCardNumber(): string {
  const year = new Date().getFullYear();
  const block = () =>
    Math.floor(1000 + Math.random() * 9000).toString();
  return `LC-${year}-${block()}-${block()}`;
}

/** Nombre legible a partir del email cuando no hay nombre completo. */
export function displayName(user: { fullName: string | null; email: string }): string {
  return user.fullName?.trim() || user.email.split('@')[0];
}

/**
 * Normaliza el análisis del diagnóstico. Si proviene de un formato antiguo
 * (un objeto JSON con "analisis"), extrae solo el markdown legible. Si ya es
 * markdown, lo devuelve tal cual.
 */
export function limpiarAnalisis(raw: string | null | undefined): string {
  if (!raw) return '';
  const t = raw.trim();
  if (t.startsWith('{') && t.includes('"analisis"')) {
    // Captura el valor de "analisis" (último campo) aunque el JSON sea inválido.
    const m = t.match(/"analisis"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
    let val = m ? m[1] : t;
    val = val
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
    return val.trim();
  }
  return raw;
}
