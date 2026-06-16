// Seed de datos iniciales (Farmacias lingüísticas).
// Ejecutar con: npm run db:seed
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const FARMACIAS = [
  {
    name: 'Píldoras del Subjuntivo',
    category: 'grammar',
    targetLevel: 'B1',
    description: 'Tratamiento intensivo para dominar el modo subjuntivo sin efectos secundarios.',
  },
  {
    name: 'Jarabe de Vocabulario Andaluz',
    category: 'vocabulary',
    targetLevel: 'A2',
    description: 'Expresiones y palabras de Granada para hablar como un local.',
  },
  {
    name: 'Pomada de Conversación',
    category: 'conversation',
    targetLevel: 'B2',
    description: 'Fluidez y naturalidad para conversaciones cotidianas.',
  },
  {
    name: 'Cápsulas Culturales: Alhambra',
    category: 'cultural',
    targetLevel: 'B1',
    description: 'Historia, arte y léxico en torno al monumento de Granada.',
  },
  {
    name: 'Tratamiento de Escritura Formal',
    category: 'writing',
    targetLevel: 'C1',
    description: 'Redacción de textos académicos y profesionales en español.',
  },
  {
    name: 'Inyección Audiovisual: Cine Español',
    category: 'audiovisual',
    targetLevel: 'B2',
    description: 'Comprensión auditiva a través del cine y las series en español.',
  },
];

async function main() {
  for (const f of FARMACIAS) {
    const existing = await prisma.farmacia.findFirst({ where: { name: f.name } });
    if (!existing) {
      await prisma.farmacia.create({ data: { ...f, resourcesCount: 0 } });
      console.log(`+ Farmacia creada: ${f.name}`);
    }
  }
  console.log('Seed completado ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
