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

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Clínica Cultural <onboarding@resend.dev>',
    to,
    subject: '🔑 Tu enlace mágico — Clínica Cultural y Lingüística',
    html: magicLinkEmailHtml(magicLink),
  });

  return { delivered: true, magicLink };
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
