# Clínica Cultural y Lingüística de Español — Guía de desarrollo (handoff)

Documento de traspaso para que otra persona (o agente) pueda **entender, mantener
y ampliar** el proyecto sin contexto previo. Última actualización: sesión de
junio de 2026.

---

## 1. Qué es

Aplicación web de la **Universidad de Granada** (en colaboración con el Centro de
Lenguas Modernas) para aprender español como una "clínica": el estudiante se
**diagnostica**, recibe un **plan de tratamiento** y lo aplica con recursos,
cultura y conversación real en Granada. No es un curso al uso: combina lengua +
inmersión cultural + una mini serie web.

La metáfora médica es transversal: **Diagnóstico**, **Farmacias lingüísticas**
(píldoras/jarabes/pomadas/inyecciones), **La Doctora** (tutora IA), **Seguro LC**
(carnet con descuentos), **Enfermería LC** (parejas lingüísticas), etc.

---

## 2. Stack

- **Next.js 14** (App Router, Server Components) + **TypeScript** + **Tailwind CSS**.
- **Prisma 6** sobre **PostgreSQL (Neon)**. El cliente se genera en `./generated/prisma`
  y se importa como `@/generated/prisma` (envuelto en `lib/prisma.ts`).
- **Auth propia con Magic Link** (sin NextAuth): `jose` (JWT) + cookie httpOnly.
- **Claude API** (`@anthropic-ai/sdk`) para La Doctora y el análisis del diagnóstico.
- **Resend** para email (magic link y formulario de contacto).
- **Vercel Blob** para subir archivos del portafolio.
- **Stripe** para el checkout de matrícula (parcial; ver Pendientes).
- **react-leaflet** (rutas), **react-markdown** (render de markdown), **html2pdf.js**
  (PDF en cliente).
- Despliegue en **Vercel**. `main` = producción; cada push despliega.

---

## 3. Puesta en marcha

```bash
npm install                 # postinstall ejecuta `prisma generate`
npm run dev                 # desarrollo
npm run build               # prisma generate + next build
npm run db:seed             # carga farmacias iniciales (prisma/seed.mjs)
```

### Verificar el build sin base de datos
El build ejecuta `prisma generate` pero la app no necesita BD para compilar. Para
comprobar el build de forma aislada (sin que `.env` apunte a una BD viva):

```bash
mv .env .env.bak; DATABASE_URL= npx next build; mv .env.bak .env
```

### Base de datos / migraciones (IMPORTANTE)
- Hay migraciones de Prisma en `prisma/migrations/` (`init`, `reservas`,
  `ficha_paciente`).
- **Las migraciones a producción (Neon) se ejecutan a mano**: se genera el SQL y
  el responsable lo pega en la consola de Neon. No hay `migrate deploy` automático.
- Cambios de esquema posteriores aplicados manualmente:
  - `recursos`: columnas `content TEXT`, `lexico JSONB`, `dosis TEXT`,
    `formato TEXT`, `posicion INTEGER`, `slug TEXT`.
  - `farmacias.category` cambiada de enum a `TEXT` (categorías libres).
- Regla práctica: **si tocas `schema.prisma`, genera el SQL equivalente y pásalo
  para ejecutarlo en Neon antes de desplegar el código que lo usa.**

---

## 4. Variables de entorno (relevantes del proyecto)

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión Postgres (Neon en prod; local en dev). |
| `SESSION_SECRET` | Firma del JWT de sesión (mín. 16 chars). **Obligatoria en prod.** |
| `NEXT_PUBLIC_URL` | URL base para construir el magic link. |
| `RESEND_API_KEY` | Envío de emails. Si falta → modo demo (loguea en consola). |
| `EMAIL_FROM` | Remitente de los correos. |
| `CONTACT_EMAIL` | Destino del formulario de contacto (si falta, usa el 1º de `ADMIN_EMAILS`). |
| `CLAUDE_API_KEY` | La Doctora / análisis. Si falta → respuestas demo. |
| `CLAUDE_MODEL` | Modelo (por defecto `claude-sonnet-4-6`). |
| `ADMIN_EMAILS` | Lista (coma) de emails que reciben rol `admin` al entrar. |
| `PROFESSOR_EMAILS` | Lista (coma) de emails que reciben rol `professor` al entrar. |
| `PREMIUM_EMAILS` | Emails exentos de límites de visitante (plan de pago "manual"). |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (subida de archivos del portafolio). |
| `STRIPE_SECRET_KEY` | Checkout de matrícula. |

`.env` está en `.gitignore`. Nunca commitear secretos.

---

## 5. Arquitectura transversal

### Autenticación (lib/auth.ts)
- **Magic link**: `createMagicLinkToken(email)` guarda el hash del token
  (`MagicLinkToken`) con caducidad 15 min. `consumeMagicLinkToken` lo valida y marca usado.
- **Sesión**: JWT firmado con `jose` en cookie httpOnly `cc_session` (7 días).
- `getSessionUser()` verifica la cookie y **relee el usuario de la BD en cada
  petición** → cambiar el rol en BD surte efecto al instante, sin re-login.
- `upsertUserByEmail(email)` crea/recupera el usuario y le asigna rol según
  `ADMIN_EMAILS` / `PROFESSOR_EMAILS` (admin tiene prioridad; nunca degrada un rol existente).

### Datos (lib/prisma.ts)
- Singleton de PrismaClient generado en `@/generated/prisma`.

### IA (lib/claude.ts) — todo "demo-safe" si no hay API key
- `askClaudeLinguistic(history, level)` → chat de La Doctora. El system prompt se
  genera con `resumenClinica()` (de `lib/clinica-info.ts`), que **lee en vivo** las
  rutas y los recursos, de modo que La Doctora siempre conoce las secciones y
  contenidos actuales.
- `analizarDiagnostico({...})` → corrige la expresión escrita y devuelve
  `{ writingScore, analisisMarkdown }`. Primera línea `SCORE: N`, resto markdown.
- `feedbackPoetico({...})` → feedback de la Escuela de Poetas.

### Email (lib/resend.ts)
- `sendMagicLinkEmail`, `sendContactEmail`. Degradan a consola si no hay `RESEND_API_KEY`.

### Almacenamiento (Vercel Blob)
- Subida **desde el cliente** (`@vercel/blob/client`) vía `app/api/portafolio/upload`
  (`handleUpload`), para admitir archivos grandes (audio/vídeo, hasta 200 MB).

---

## 6. Modelo de datos (prisma/schema.prisma)

Modelos principales: `User`, `MagicLinkToken`, `Session`, `Diagnosis`, `SeguroLC`,
`Farmacia`, `Recurso`, `Portafolio`, `ActividadCultural`, `ChatLineaEmergencia`,
`SesionTutoria`, `Reserva`.

Enums: `UserRole (patient | tutor_local | professor | admin)`, `LanguageLevel
(A1..C2)`, `CardStatus`, `MentorshipStatus (pending|active|completed)`,
`ContentType`, `ResourceType`, `PortfolioContentType (writing|audio|video|
miniseries_episode|project)`, `Visibility`, `ActivityType`, `SessionStatus
(scheduled|completed|cancelled)`, `ReservaEstado`. (`FarmaciaCategory` quedó en
desuso: `farmacias.category` es ahora texto libre.)

Notas clave:
- `User.profilePictureUrl` guarda la foto como **data URL** (recortada/comprimida
  en el cliente).
- `SeguroLC` tiene `linkedTutorId` (pareja), `mentorshipStatus`,
  `mentoringSessionsUsed/Total` (cupo de tutoría incluida).
- `SesionTutoria`: `seguroLcId` distingue la **vía pareja** (con `seguroLcId`) de la
  **vía profesor** (sin `seguroLcId`).
- `Recurso` (ampliado): `content` (markdown), `lexico` (JSON palabra→definición),
  `dosis`, `formato`, `posicion`, `slug`.

---

## 7. Roles y permisos

- **patient**: estudiante. Acceso a todas las secciones de aprendizaje.
- **tutor_local**: mentor/estudiante local acompañante (Enfermería LC).
- **professor**: profesorado (tutoría de pago + gestión de contenidos).
- **admin**: super administrador (gestión de usuarios + todo lo de profesor).

El **menú lateral depende del rol** (`components/Dashboard/DashboardNav.tsx`,
recibe `role` desde `app/dashboard/layout.tsx`):
- patient → todas las secciones de paciente.
- tutor_local → Resumen, Enfermería LC, Tutoría, Seguro LC, Actividades, Rutas, Ajustes.
- professor → Resumen, Panel profesor, Contenidos, Tutoría, Ajustes.
- admin → Resumen, Administración, Panel profesor, Contenidos, Tutoría, Ajustes.

`getSessionUser` lee el rol fresco, así que las altas de rol se aplican al instante.

---

## 8. Mapa de la aplicación

### Público
- `/` Home (hero + introducción + features + invitación a mentores + entidades colaboradoras).
- `/programa` programa, horario y precios (consciente de la sesión: muestra "Mi Dashboard").
- `/sobre-clinica`, `/contacto`, `/legal/*`.
- `/login`, `/completar-perfil` (ficha obligatoria en el primer acceso).

### Dashboard (`/dashboard/*`)
Resumen, Diagnóstico, Farmacias (+`/[id]`), Actividades, Rutas (+`/[slug]`),
Laboratorio de cine, Escuela de Poetas, Tutoría, Enfermería LC, Portafolio,
Seguro LC, Emergencia (La Doctora), Ajustes, **Contenidos** (+`/[id]`),
Panel profesor, Administración.

### API (`app/api/*`)
- `auth/magic-link`, `auth/verify`, `auth/logout`.
- `diagnoses` (crea diagnóstico + análisis IA), `perfil` (ficha + foto).
- `chat/emergencia` (La Doctora; con límite de visitante).
- `seguro-lc`, `enfermeria` (solicitar pareja), `mentor` (alta de mentor autoservicio),
  `tutoria` (reservar/estado, vía pareja y profesor), `reservas`.
- `portafolio` (+`/upload`), `poesia/feedback`.
- `contacto`, `checkout` (Stripe).
- `profesor/asignar-pareja`, `profesor/feedback`.
- `admin/usuarios` (rol/nombre/baja), `admin/farmacias`, `admin/recursos`,
  `admin/contenidos/importar`.

---

## 9. Funcionalidades (qué hace cada una y archivos clave)

- **Diagnóstico**: test multisección (gramática MCQ, comprensión auditiva con TTS,
  comprensión lectora, expresión escrita) → calcula nivel + análisis IA + plan +
  informe PDF. `components/Forms/DiagnosticoTest.tsx`, `app/api/diagnoses`,
  `app/dashboard/diagnostico`, `components/InformeHoja.tsx`.
- **La Doctora (Emergencia IA)**: chat con la tutora IA. `components/Chat/ChatBox.tsx`,
  `app/api/chat/emergencia`. **Visitantes: 3 consultas gratis**, luego propone plan.
- **Farmacias lingüísticas**: catálogo por farmacia; cada recurso es una lectura
  markdown con **léxico (chips con definición + enlace a la RAE)** y descarga en PDF.
  Lee de la BD (`lib/recursosDb.ts`) con repliegue al contenido en código
  (`lib/recursos.ts`). `components/LexicoChip.tsx`, `components/RecursoPdfButton.tsx`.
- **Gestión de contenidos** (profesor/admin): ver sección 11.
- **Rutas culturales**: mapa Leaflet con paradas y léxico. `lib/rutas.ts`,
  `components/Rutas/*` (carga dinámica `ssr:false`).
- **Escuela de Poetas**: retos de escritura + taller con feedback IA y guardado en
  portafolio. `lib/poesia.ts`, `components/Poetas/TallerEscritura.tsx`.
- **Laboratorio de cine**: mini serie colectiva (capítulos por fase) + metodología +
  **carpeta pública de Google Drive incrustada (iframe)**. `lib/laboratorio.ts`,
  `components/Laboratorio/DriveArchivo.tsx`.
- **Tutoría (bidireccional)**: vía **pareja** (incluida en el Seguro LC, con cupo) y
  vía **profesor** (plan de pago; el profesor "acepta" solicitudes). Role-aware.
  `app/dashboard/tutoria`, `app/api/tutoria`, `components/Tutoria/*`.
- **Enfermería LC**: parejas lingüísticas. El paciente solicita pareja; el mentor la
  acepta. Alta de mentor en autoservicio. Invitación en la Home.
  `app/dashboard/enfermeria-lc`, `app/api/mentor`, `components/Enfermeria/*`.
- **Seguro LC**: tarjeta digital (foto tipo carnet, role-aware para mentores) +
  beneficios. `app/dashboard/seguro-lc`.
- **Portafolio**: subida de trabajos (Vercel Blob o enlace), preview por tipo,
  feedback del profesor, eliminación. `app/dashboard/portafolio`,
  `components/Portafolio/*`.
- **Actividades + reservas**: agenda con descuento del Seguro LC. `lib/actividades.ts`.
- **Ficha de paciente**: obligatoria en el primer acceso; editable en Ajustes; incluye foto.
  `components/FichaForm.tsx`, `app/completar-perfil`, `app/dashboard/settings`.
- **Contacto**: formulario público que envía email (Resend) con honeypot anti-spam.
  `app/contacto`, `components/ContactoForm.tsx`, `app/api/contacto`.
- **Entidades colaboradoras**: sección editable en la Home. `lib/colaboradores.ts`.
- **Panel profesor**: parejas pendientes, portafolios por revisar, pacientes.
- **Administración**: métricas + gestión de usuarios (rol, editar nombre, dar de baja,
  alta por email). `app/dashboard/admin`, `components/Admin/*`, `app/api/admin/usuarios`.

---

## 10. Modelo de negocio / planes / freemium

`/programa` define tres planes:
- **Mensual (350€/mes)** y **Curso completo (945€/3 meses)**: acceso completo,
  sesiones presenciales (Mar y Jue 10–14, Mié 16–20; 12 h/sem), tutoría con pareja,
  descuentos en actividades (Seguro LC), **certificado al completar**.
- **A demanda (5€/hora)**: pagas las horas presenciales; **cada bono de horas abre
  toda la clínica digital esa semana** (bono temporal semanal); actividades a precio
  completo; certificado al completar.
- **Actividades/excursiones culturales**: de pago para todos (con descuento para
  suscriptores). *Pendiente: posibles gratis vía entidades colaboradoras.*
- **Visitante (gratis)**: diagnóstico + La Doctora (3 consultas) + Rutas + 1 muestra.

**Gating actual** (`lib/planes.ts`): `tienePlanProfesor()` (vía profesor) y
`tieneAccesoCompleto()` (sin límite de visitante) son **stubs** que conceden acceso
al equipo (admin/profesor/mentor) y a `PREMIUM_EMAILS`. **Pendiente**: conectar a la
suscripción real cuando exista el sistema de pagos (ver Pendientes). El límite de La
Doctora cuenta las filas de `ChatLineaEmergencia` por usuario.

---

## 11. Gestión de contenidos (CMS en BD)

El contenido de las Farmacias vive en la BD (modelos `Farmacia` y `Recurso`). El
contenido "de fábrica" sigue en `lib/recursos.ts` como semilla/repliegue.

- **Lectura**: `lib/recursosDb.ts#getRecursosDeFarmacia(farmacia)` devuelve los
  recursos de la BD; si la farmacia no tiene ninguno, repliega a `lib/recursos.ts`.
- **Importar contenido base**: `POST /api/admin/contenidos/importar` copia
  `lib/recursos.ts` → tabla `recursos` (idempotente por `slug`). Botón en
  `/dashboard/contenidos`.
- **Editor** (`/dashboard/contenidos`, profesor/admin):
  - Crear/editar/borrar **farmacias** (categoría libre) → `app/api/admin/farmacias`.
  - Crear/editar/borrar **recursos** (título, dosis, formato, nivel, minutos,
    descripción, **cuerpo markdown**, **léxico** «palabra = definición») →
    `app/api/admin/recursos`. Componentes en `components/Contenidos/*`.
- **Diseño agnóstico a categorías**: los recursos cuelgan de `farmaciaId`, no de la
  categoría, y `category` es texto libre → se pueden crear nuevas farmacias
  (Enfermería, Clínica del habla, Olores y sabores…) sin tocar código.

**Workflow para ampliar el esquema** (recordatorio): editar `schema.prisma` →
`npx prisma generate` → generar el SQL `ALTER TABLE` equivalente → ejecutarlo en
Neon → desplegar el código. El SQL ya aplicado para el CMS:

```sql
ALTER TABLE "recursos"
  ADD COLUMN IF NOT EXISTS "content"  TEXT,
  ADD COLUMN IF NOT EXISTS "lexico"   JSONB,
  ADD COLUMN IF NOT EXISTS "dosis"    TEXT,
  ADD COLUMN IF NOT EXISTS "formato"  TEXT,
  ADD COLUMN IF NOT EXISTS "posicion" INTEGER,
  ADD COLUMN IF NOT EXISTS "slug"     TEXT;
ALTER TABLE "farmacias" ALTER COLUMN "category" TYPE TEXT USING "category"::text;
```

---

## 12. Convenciones

- **Paleta** (Tailwind): `clinic-red #D84C4C`, `clinic-green #5A8C6E`,
  `clinic-gold #D4A574`, `clinic-blue #2C3E50`, `clinic-white #FAFAFA`,
  `clinic-gray #E8E8E8`. ⚠️ No construir clases de color dinámicamente
  (`bg-${x}`): Tailwind no las detecta; usar nombres de clase completos.
- **Tono**: español, cálido, con metáfora médica sin abusar.
- **Markdown**: render con `components/Chat/ChatMarkdown.tsx` (enlaces internos via
  next/link, salto de página para PDFs).
- **Patrón demo-safe**: integraciones externas (Claude, Resend) no deben romper si
  falta la API key.
- **Git**: `main` = producción (cada push despliega en Vercel). Históricamente se
  trabajó en una rama de feature con PR; también se ha hecho push directo a `main`
  cuando se pidió. Verificar build antes de subir.

---

## 13. Pendientes / roadmap

- **Sistema de pagos (Stripe)**: completar el checkout y, sobre todo, **conectar el
  gating** (`lib/planes.ts`): suscripción activa (mensual/curso), bono semanal del
  plan a demanda, y exención del límite de La Doctora para suscriptores.
- **Mini serie colectiva**: agrupar en el Portafolio los trabajos tipo
  `miniseries_episode` por capítulo, con visibilidad compartida (hoy el portafolio
  es individual). Requiere nº de capítulo + visibilidad.
- **Actividades gratuitas vía entidades colaboradoras** (a confirmar).
- **Baja "blanda" de usuarios** (hoy es borrado definitivo): requeriría un campo de
  estado en `User` (esquema/SQL).
- **Página de detalle de ruta** `/dashboard/rutas/[slug]` (existe; revisar contenido).
- Revisar que el **iframe de Drive** del Laboratorio carga (carpeta "cualquiera con el enlace").

---

## 14. Notas operativas (Vercel / config)

- Tras conectar **Vercel Blob**, se añade `BLOB_READ_WRITE_TOKEN`; las variables
  nuevas solo entran con un **redeploy**.
- `CONTACT_EMAIL` debe existir en producción para recibir los contactos.
- `PROFESSOR_EMAILS` / `ADMIN_EMAILS` asignan rol al entrar; alternativamente, el
  admin gestiona roles desde **Administración**.
- Tras desplegar el CMS, ejecutar una vez **"Importar contenido base"** en Contenidos.
- Existe (o existió) un proyecto Vercel duplicado `clinica-cultural-xuvr`: el bueno
  es `clinica-cultural`.
