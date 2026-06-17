import { prisma } from '@/lib/prisma';
import { recursosDe, type Recurso, type TipoDosis, type Formato } from '@/lib/recursos';

type RecursoRow = {
  id: string;
  title: string;
  dosis: string | null;
  formato: string | null;
  difficultyLevel: string | null;
  durationMinutes: number | null;
  description: string | null;
  content: string | null;
  contentUrl: string | null;
  lexico: unknown;
};

/** Convierte una fila de la BD a la forma que usa la interfaz (Recurso). */
export function mapDbRecurso(row: RecursoRow): Recurso {
  return {
    id: row.id,
    titulo: row.title,
    tipo: (row.dosis ?? 'pildora') as TipoDosis,
    formato: (row.formato ?? 'texto') as Formato,
    nivel: row.difficultyLevel ?? '',
    duracionMin: row.durationMinutes ?? 0,
    descripcion: row.description ?? '',
    contenido: row.content ?? '',
    url: row.contentUrl ?? undefined,
    lexico: (row.lexico as Record<string, string> | null) ?? undefined,
  };
}

/**
 * Recursos de una farmacia. Lee de la BD; si la farmacia aún no tiene recursos
 * en BD, cae a los del código (transición segura mientras no se importa).
 */
export async function getRecursosDeFarmacia(farmacia: {
  id: string;
  category: string | null;
}): Promise<Recurso[]> {
  const rows = await prisma.recurso.findMany({
    where: { farmaciaId: farmacia.id },
    orderBy: [{ posicion: 'asc' }, { createdAt: 'asc' }],
  });
  if (rows.length > 0) return rows.map((r) => mapDbRecurso(r as unknown as RecursoRow));
  return recursosDe(farmacia.category);
}
