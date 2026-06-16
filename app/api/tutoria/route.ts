import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tienePlanProfesor } from '@/lib/planes';

const ROLES_TUTOR = ['professor', 'tutor_local', 'admin'];
const ROLES_PROFESOR = ['professor', 'admin'];

const crearSchema = z.object({
  tipo: z.enum(['mentor', 'professor']).default('mentor'),
  scheduledDate: z.string().min(1),
  notes: z.string().max(500).optional().or(z.literal('')),
});

const estadoSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  claim: z.boolean().optional(),
});

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

/**
 * El paciente reserva una sesión de tutoría. Dos vías:
 *  - 'mentor': con su pareja lingüística (incluida en el Seguro LC, con cupo).
 *  - 'professor': con un profesor (plan de pago); sin cupo del Seguro, la
 *    reclama un profesor después.
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = crearSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisa la fecha de la sesión' }, { status: 400 });
  }

  const fecha = new Date(parsed.data.scheduledDate);
  if (isNaN(fecha.getTime())) {
    return NextResponse.json({ error: 'Fecha no válida' }, { status: 400 });
  }
  const notes = clean(parsed.data.notes);

  // ── Vía profesor (plan de pago) ──
  if (parsed.data.tipo === 'professor') {
    if (!tienePlanProfesor(user)) {
      return NextResponse.json(
        { error: 'La tutoría con profesorado está incluida en el plan de pago.' },
        { status: 403 }
      );
    }
    const sesion = await prisma.sesionTutoria.create({
      data: {
        seguroLcId: null, // la distingue de la vía pareja/mentor
        tutorId: null, // la reclama un profesor
        patientId: user.id,
        scheduledDate: fecha,
        durationMinutes: 60,
        status: 'scheduled',
        notes,
      },
    });
    return NextResponse.json({ ok: true, id: sesion.id });
  }

  // ── Vía pareja/mentor (incluida en el Seguro LC) ──
  const seguro = await prisma.seguroLC.findUnique({ where: { userId: user.id } });
  if (!seguro || !seguro.linkedTutorId) {
    return NextResponse.json(
      { error: 'Necesitas tener una pareja lingüística asignada en Enfermería LC.' },
      { status: 400 }
    );
  }

  // Cupo: realizadas (used) + programadas no pueden superar el total.
  const programadas = await prisma.sesionTutoria.count({
    where: { seguroLcId: seguro.id, status: 'scheduled' },
  });
  if (seguro.mentoringSessionsUsed + programadas >= seguro.mentoringSessionsTotal) {
    return NextResponse.json({ error: 'No te quedan sesiones disponibles.' }, { status: 400 });
  }

  const sesion = await prisma.sesionTutoria.create({
    data: {
      seguroLcId: seguro.id,
      tutorId: seguro.linkedTutorId,
      patientId: user.id,
      scheduledDate: fecha,
      durationMinutes: 60,
      status: 'scheduled',
      notes,
    },
  });

  return NextResponse.json({ ok: true, id: sesion.id });
}

/** Cambia el estado de una sesión (realizar/cancelar). Ajusta el cupo usado. */
export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const parsed = estadoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
  }
  const { id, status, claim } = parsed.data;

  const sesion = await prisma.sesionTutoria.findUnique({ where: { id } });
  if (!sesion) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });

  // Un profesor reclama una solicitud de tutoría de pago sin asignar.
  if (claim) {
    if (!ROLES_PROFESOR.includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }
    if (sesion.tutorId) {
      return NextResponse.json({ error: 'Esta sesión ya está asignada.' }, { status: 400 });
    }
    await prisma.sesionTutoria.update({ where: { id }, data: { tutorId: user.id } });
    return NextResponse.json({ ok: true });
  }

  if (!status) {
    return NextResponse.json({ error: 'Falta el estado' }, { status: 400 });
  }

  const esTutor = ROLES_TUTOR.includes(user.role) && sesion.tutorId === user.id;
  const esPaciente = sesion.patientId === user.id;
  // El paciente solo puede cancelar; el tutor puede realizar o cancelar.
  if (!esTutor && !(esPaciente && status === 'cancelled')) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  const eraRealizada = sesion.status === 'completed';
  const seraRealizada = status === 'completed';

  await prisma.$transaction(async (tx) => {
    await tx.sesionTutoria.update({
      where: { id },
      data: {
        status,
        actualDate: seraRealizada ? new Date() : sesion.actualDate,
      },
    });

    // Mantiene el contador de sesiones usadas del Seguro LC.
    if (sesion.seguroLcId && eraRealizada !== seraRealizada) {
      await tx.seguroLC.update({
        where: { id: sesion.seguroLcId },
        data: { mentoringSessionsUsed: { [seraRealizada ? 'increment' : 'decrement']: 1 } },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
