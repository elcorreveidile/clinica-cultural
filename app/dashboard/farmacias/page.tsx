import { prisma } from '@/lib/prisma';

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  grammar: { label: 'Gramática', icon: '💊' },
  vocabulary: { label: 'Vocabulario', icon: '🧪' },
  cultural: { label: 'Cultura', icon: '🏛️' },
  conversation: { label: 'Conversación', icon: '💬' },
  writing: { label: 'Escritura', icon: '✍️' },
  audiovisual: { label: 'Audiovisual', icon: '🎬' },
};

export default async function FarmaciasPage() {
  const farmacias = await prisma.farmacia.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { recursos: true } } },
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-clinic-blue flex items-center gap-2">
          💊 Farmacias Lingüísticas
        </h1>
        <p className="text-clinic-blue/60">
          Píldoras gramaticales, pomadas literarias y jarabes culturales para tu tratamiento.
        </p>
      </div>

      {farmacias.length === 0 ? (
        <div className="bg-white border border-clinic-gray rounded-2xl p-8 text-center text-clinic-blue/60">
          Todavía no hay farmacias cargadas. Ejecuta el seed:{' '}
          <code className="bg-clinic-gray/50 px-2 py-0.5 rounded">npm run db:seed</code>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmacias.map((f) => {
            const cat = CATEGORY_LABELS[f.category ?? 'grammar'] ?? {
              label: f.category,
              icon: '💊',
            };
            return (
              <div
                key={f.id}
                className="bg-white border border-clinic-gray rounded-2xl p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{cat.icon}</span>
                  {f.targetLevel && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-clinic-green/10 text-clinic-green">
                      {f.targetLevel}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-clinic-blue">{f.name}</h2>
                <p className="text-xs text-clinic-gold font-semibold uppercase mb-2">
                  {cat.label}
                </p>
                <p className="text-sm text-clinic-blue/60">{f.description}</p>
                <p className="text-xs text-clinic-blue/40 mt-4">
                  {f._count.recursos} recurso(s) disponibles
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
