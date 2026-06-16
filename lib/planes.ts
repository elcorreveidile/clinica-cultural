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
