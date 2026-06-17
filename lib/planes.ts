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

// ───────────────────────── Tutoría con profesorado ─────────────────────────
// La tutoría (profesor ↔ alumno matriculado) está incluida en los paquetes,
// con un cupo según el plan de matrícula del alumno.
export const CUPO_TUTORIAS: Record<string, number> = {
  mensual: 2,
  trimestral: 8,
};

/** Cupo de tutorías con profesorado según el plan de matrícula del alumno. */
export function cupoTutorias(plan: string | null | undefined): number {
  if (!plan) return 0;
  return CUPO_TUTORIAS[plan] ?? 0;
}

/**
 * ¿Puede el usuario reservar tutoría con profesorado? Está matriculado (plan
 * mensual/trimestral) o es del equipo/premium (para pruebas).
 * TODO (pagos): el plan lo fijará la suscripción real.
 */
export function puedeTutoriaProfesor(user: { role: string; email: string; plan?: string | null }): boolean {
  if (user.plan && cupoTutorias(user.plan) > 0) return true;
  if (user.role === 'admin' || user.role === 'professor') return true;
  const lista = (process.env.PREMIUM_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(user.email.toLowerCase());
}

/** Cupo efectivo de tutorías: el del plan, o uno de prueba para equipo/premium. */
export function cupoTutoriasEfectivo(user: { role: string; email: string; plan?: string | null }): number {
  if (user.plan) return cupoTutorias(user.plan);
  return puedeTutoriaProfesor(user) ? CUPO_TUTORIAS.trimestral : 0;
}
