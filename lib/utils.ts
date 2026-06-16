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
