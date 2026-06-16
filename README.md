# 🏥 Clínica Cultural y Lingüística de Español

Plataforma web que reinventa el aprendizaje del español con la metáfora de una clínica:
diagnóstico de nivel, "farmacias" de recursos, Seguro LC (tarjeta de paciente) y una
Línea de Emergencia Lingüística con IA.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **PostgreSQL** (Neon en producción) + **Prisma ORM**
- **Resend** — envío del Magic Link por email
- **Claude API** (`@anthropic-ai/sdk`) — chat de la Línea de Emergencia
- **Stripe** — pagos (preparado para el futuro)
- Autenticación **Magic Link propia** (sin NextAuth): token de un solo uso + sesión
  firmada con JWT (`jose`) en cookie httpOnly.

## Puesta en marcha

```bash
# 1. Variables de entorno
cp .env.example .env   # rellena DATABASE_URL, RESEND_API_KEY, CLAUDE_API_KEY, etc.

# 2. Dependencias
npm install

# 3. Base de datos (Neon o Postgres local)
npx prisma migrate dev      # crea las tablas
npm run db:seed             # carga las farmacias de ejemplo

# 4. Desarrollo
npm run dev                 # http://localhost:3000
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (Neon: `...?sslmode=require`) |
| `RESEND_API_KEY` | API key de Resend. Sin ella, el Magic Link se imprime en consola. |
| `EMAIL_FROM` | Remitente del email (ej. `Clínica <onboarding@resend.dev>`) |
| `CLAUDE_API_KEY` | API key de Anthropic. Sin ella, el chat responde en modo demo. |
| `CLAUDE_MODEL` | Modelo de Claude (por defecto `claude-sonnet-4-6`) |
| `SESSION_SECRET` | Secreto para firmar las cookies de sesión (mín. 16 caracteres) |
| `NEXT_PUBLIC_URL` | URL base de la app (`http://localhost:3000` en local) |

> **Modo demo:** la app funciona sin claves de Resend ni Claude. El enlace mágico se
> muestra en la consola del servidor (y en la pantalla de login), y el chat devuelve
> una respuesta simulada. Configura las claves reales para activar el envío de correo
> y las respuestas de Claude.

## Estructura

```
app/
  page.tsx                     Landing
  login/                       Login con Magic Link
  dashboard/                   Área privada (protegida por sesión)
    page.tsx                   Resumen
    diagnostico/               Test de nivel (MCER)
    farmacias/                 Catálogo de recursos
    seguro-lc/                 Tarjeta digital del paciente
    emergencia/                Chat IA (El Doctor)
  api/
    auth/magic-link/           Genera y envía el enlace mágico
    auth/verify/               Valida el token y crea la sesión
    auth/logout/               Cierra sesión
    chat/emergencia/           Chat con Claude
    diagnoses/                 Guarda el diagnóstico
    seguro-lc/                 Activa el Seguro LC
components/                     Header, Chat, Dashboard, Forms
lib/                           prisma, auth, claude, resend, types, utils
prisma/                        schema.prisma, migraciones, seed
```

## Flujo de autenticación (Magic Link)

1. El usuario introduce su email en `/login`.
2. `POST /api/auth/magic-link` genera un token aleatorio, guarda su **hash** en BD
   (caduca en 15 min) y envía el enlace con Resend.
3. El usuario abre `/api/auth/verify?token=…`: se valida y consume el token, se crea/recupera
   el usuario y se firma una cookie de sesión JWT.
4. El `layout` de `/dashboard` exige sesión válida; si no, redirige a `/login`.

## Paleta de colores

`clinic-red #D84C4C` · `clinic-green #5A8C6E` · `clinic-gold #D4A574` ·
`clinic-blue #2C3E50` · `clinic-white #FAFAFA` · `clinic-gray #E8E8E8`
