// Gate del plan de pago para la tutoría con profesorado.
//
// TODO (sistema de pagos): cuando exista el cobro, este check debe leer el
// estado de la suscripción del usuario (p. ej. un campo en BD). De momento
// es configurable por email (PREMIUM_EMAILS) y está abierto al equipo
// (admin/profesor) para poder probar la vía de profesor.

export function tienePlanProfesor(user: { role: string; email: string }): boolean {
  if (user.role === 'admin' || user.role === 'professor') return true;
  const lista = (process.env.PREMIUM_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(user.email.toLowerCase());
}

// Acceso completo a la clínica (sin límites de "visitante"). De momento lo
// tienen el equipo (admin/profesor/mentor) y los emails premium.
// TODO (pagos): incluir aquí la suscripción activa (mensual/curso) y el bono
// semanal del plan a demanda.
export function tieneAccesoCompleto(user: { role: string; email: string }): boolean {
  if (['admin', 'professor', 'tutor_local'].includes(user.role)) return true;
  const lista = (process.env.PREMIUM_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(user.email.toLowerCase());
}

// Nº de consultas gratuitas con La Doctora para un visitante.
export const LIMITE_CONSULTAS_VISITANTE = 3;
