import { COLABORADORES, inicialesColaborador } from '@/lib/colaboradores';

export default function Colaboradores() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-clinic-blue mb-2">
          Entidades colaboradoras
        </h2>
        <p className="text-clinic-blue/60 max-w-2xl mx-auto">
          La Clínica Cultural y Lingüística de Español nace del trabajo conjunto con instituciones
          comprometidas con la enseñanza del español y la vida cultural de Granada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COLABORADORES.map((c) => {
          const Card = (
            <div className="h-full bg-white border border-clinic-gray rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition">
              <div className="h-14 w-14 rounded-xl bg-clinic-gray/60 text-clinic-blue flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logo} alt={c.nombre} className="h-full w-full object-contain p-1" />
                ) : (
                  <span>{inicialesColaborador(c.nombre)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-clinic-blue leading-tight">{c.nombre}</p>
                <p className="text-sm text-clinic-gold font-semibold">{c.tipo}</p>
              </div>
            </div>
          );

          return c.url ? (
            <a
              key={c.nombre}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {Card}
            </a>
          ) : (
            <div key={c.nombre}>{Card}</div>
          );
        })}
      </div>

      <p className="text-center text-xs text-clinic-blue/40 mt-8">
        ¿Tu entidad quiere colaborar con la Clínica?{' '}
        <a href="/sobre-clinica" className="underline">
          Escríbenos
        </a>
        .
      </p>
    </section>
  );
}
