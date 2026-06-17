import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RECURSOS_POR_CATEGORIA, type CategoriaFarmacia } from '@/lib/recursos';

const ROLES_GESTION = ['professor', 'admin'];

/**
 * Importa a la base de datos los recursos que hoy viven en el código
 * (lib/recursos.ts). Idempotente: no duplica los que ya existen (por slug).
 */
export async function POST() {
  const user = await getSessionUser();
  if (!user || !ROLES_GESTION.includes(user.role)) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  let creados = 0;
  let omitidos = 0;
  const categorias = Object.keys(RECURSOS_POR_CATEGORIA) as CategoriaFarmacia[];

  for (const cat of categorias) {
    const farmacia = await prisma.farmacia.findFirst({ where: { category: cat } });
    if (!farmacia) continue;

    const recursos = RECURSOS_POR_CATEGORIA[cat];
    for (let i = 0; i < recursos.length; i++) {
      const r = recursos[i];
      const existe = await prisma.recurso.findFirst({
        where: { farmaciaId: farmacia.id, slug: r.id },
      });
      if (existe) {
        omitidos++;
        continue;
      }
      await prisma.recurso.create({
        data: {
          farmaciaId: farmacia.id,
          slug: r.id,
          title: r.titulo,
          dosis: r.tipo,
          formato: r.formato,
          difficultyLevel: (r.nivel || null) as never,
          durationMinutes: r.duracionMin,
          description: r.descripcion,
          content: r.contenido,
          contentUrl: r.url ?? null,
          lexico: r.lexico ?? undefined,
          posicion: i,
        },
      });
      creados++;
    }
  }

  return NextResponse.json({ ok: true, creados, omitidos });
}
