import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const isConfigured = Boolean(apiKey && !apiKey.includes('REEMPLAZA'));

const resend = isConfigured ? new Resend(apiKey) : null;

interface SendMagicLinkArgs {
  to: string;
  magicLink: string;
}

/**
 * Envía el email con el Magic Link. Si Resend no está configurado (entorno de
 * desarrollo sin API key), registra el enlace en consola para poder probar el
 * flujo completo sin enviar correo real.
 */
export async function sendMagicLinkEmail({ to, magicLink }: SendMagicLinkArgs): Promise<{ delivered: boolean; magicLink: string }> {
  if (!resend) {
    console.log('\n────────────────────────────────────────────────');
    console.log('📨  RESEND no configurado — Magic Link de desarrollo:');
    console.log(`    Para: ${to}`);
    console.log(`    Enlace: ${magicLink}`);
    console.log('────────────────────────────────────────────────\n');
    return { delivered: false, magicLink };
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Clínica Cultural <onboarding@resend.dev>',
    to,
    subject: '🔑 Tu enlace mágico — Clínica Cultural y Lingüística',
    html: magicLinkEmailHtml(magicLink),
  });

  // El SDK de Resend NO lanza excepción: devuelve { error } cuando el envío
  // es rechazado (dominio sin verificar, destinatario no permitido en modo
  // test, etc.). Lo propagamos para no mostrar un falso "enviado".
  if (error) {
    console.error('Resend error:', error);
    throw new Error(`Resend rechazó el envío: ${error.message ?? 'desconocido'}`);
  }

  return { delivered: true, magicLink };
}

interface SendContactArgs {
  nombre: string;
  email: string;
  organizacion?: string;
  mensaje: string;
}

/**
 * Envía un mensaje del formulario de contacto al correo de la Clínica
 * (CONTACT_EMAIL, o el primer ADMIN_EMAILS como respaldo). Si Resend no está
 * configurado o no hay destinatario, registra el mensaje en consola y no falla.
 */
export async function sendContactEmail({
  nombre,
  email,
  organizacion,
  mensaje,
}: SendContactArgs): Promise<{ delivered: boolean }> {
  const to =
    process.env.CONTACT_EMAIL ||
    (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)[0];

  if (!resend || !to) {
    console.log('\n────────────────────────────────────────────────');
    console.log('📬  Contacto (no enviado — falta RESEND/CONTACT_EMAIL):');
    console.log(`    De: ${nombre} <${email}>${organizacion ? ` · ${organizacion}` : ''}`);
    console.log(`    Mensaje: ${mensaje}`);
    console.log('────────────────────────────────────────────────\n');
    return { delivered: false };
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Clínica Cultural <onboarding@resend.dev>',
    to,
    replyTo: email,
    subject: `📬 Nuevo contacto — ${organizacion || nombre}`,
    html: contactEmailHtml({ nombre, email, organizacion, mensaje }),
  });

  if (error) {
    console.error('Resend error (contacto):', error);
    throw new Error(`Resend rechazó el envío: ${error.message ?? 'desconocido'}`);
  }

  return { delivered: true };
}

function contactEmailHtml({ nombre, email, organizacion, mensaje }: SendContactArgs): string {
  const fila = (label: string, valor: string) =>
    `<p style="margin:4px 0;"><strong style="color:#5A8C6E;">${label}:</strong> ${valor}</p>`;
  return `
  <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; color: #2C3E50;">
    <h1 style="color: #D84C4C; font-size: 20px; margin-bottom: 12px;">Nuevo mensaje de contacto</h1>
    ${fila('Nombre', nombre)}
    ${fila('Email', email)}
    ${organizacion ? fila('Entidad', organizacion) : ''}
    <div style="margin-top:16px; padding:16px; background:#F4F4F4; border-radius:8px; white-space:pre-wrap;">${mensaje}</div>
    <p style="font-size: 12px; color: #2C3E50aa; margin-top:20px;">Responde directamente a este correo para contestar a ${nombre}.</p>
  </div>`;
}

function magicLinkEmailHtml(magicLink: string): string {
  return `
  <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #2C3E50;">
    <h1 style="color: #D84C4C; font-size: 24px; margin-bottom: 8px;">Clínica Cultural y Lingüística</h1>
    <p style="color: #5A8C6E; font-weight: 600; margin-top: 0;">Sala de Diagnóstico LC</p>
    <p style="font-size: 16px; line-height: 1.5;">Pulsa el botón para acceder a tu cuenta. El enlace caduca en 15 minutos.</p>
    <a href="${magicLink}"
       style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #D84C4C; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">
      Entrar a la Clínica
    </a>
    <p style="font-size: 13px; color: #2C3E50aa;">Si no solicitaste este acceso, puedes ignorar este correo.</p>
    <p style="font-size: 13px; color: #2C3E50aa; word-break: break-all;">${magicLink}</p>
  </div>`;
}
