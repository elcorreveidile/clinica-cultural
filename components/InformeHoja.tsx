import ChatMarkdown from '@/components/Chat/ChatMarkdown';

export type ParametroInforme = { destreza: string; valor: number | null };

export interface InformeData {
  numero: string;
  fecha: string;
  nombre: string;
  email: string;
  nivel: string;
  parametros: ParametroInforme[];
  analisis: string;
}

function interpreta(v: number | null): string {
  if (v == null) return 'Pendiente';
  if (v >= 75) return 'Alto';
  if (v >= 45) return 'Medio';
  return 'En desarrollo';
}

/** Hoja del informe clínico (reutilizable: /informe y descarga directa). */
export default function InformeHoja({
  id,
  data,
}: {
  id?: string;
  data: InformeData;
}) {
  return (
    <article
      id={id}
      className="max-w-3xl mx-auto bg-white border border-clinic-gray rounded-xl print:border-0 print:rounded-none shadow-sm print:shadow-none p-8 md:p-10"
    >
      {/* Cabecera tipo analítica clínica */}
      <header className="flex items-start justify-between border-b-2 border-clinic-red pb-4 mb-6">
        <div className="flex items-center gap-3">
          <img src="/imgs/logos/logo.png" alt="Clínica Cultural" className="h-12 w-12 object-contain" />
          <div>
            <p className="font-heading font-bold text-clinic-red leading-tight">
              Clínica Cultural y Lingüística
            </p>
            <p className="text-xs text-clinic-blue/60">de Español · Universidad de Granada</p>
          </div>
        </div>
        <div className="text-right text-xs text-clinic-blue/60">
          <p className="font-semibold text-clinic-blue">INFORME DE DIAGNÓSTICO</p>
          <p>Nº {data.numero}</p>
          <p>{data.fecha}</p>
        </div>
      </header>

      {/* Datos del paciente */}
      <section className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-6">
        <p><span className="text-clinic-blue/50">Paciente:</span> <strong>{data.nombre}</strong></p>
        <p><span className="text-clinic-blue/50">Email:</span> {data.email}</p>
        <p><span className="text-clinic-blue/50">Tipo de prueba:</span> Diagnóstico lingüístico (MCER)</p>
        <p>
          <span className="text-clinic-blue/50">Nivel orientativo:</span>{' '}
          <strong className="text-clinic-red text-base">{data.nivel}</strong>
        </p>
      </section>

      {/* Tabla de parámetros */}
      <h2 className="text-sm font-bold text-clinic-blue uppercase tracking-wide mb-2">
        Parámetros analizados
      </h2>
      <table className="w-full text-sm border-collapse mb-8">
        <thead>
          <tr className="bg-clinic-gray/40 text-left text-clinic-blue/70">
            <th className="border border-clinic-gray px-3 py-2 font-semibold">Destreza</th>
            <th className="border border-clinic-gray px-3 py-2 font-semibold">Resultado</th>
            <th className="border border-clinic-gray px-3 py-2 font-semibold">Interpretación</th>
          </tr>
        </thead>
        <tbody>
          {data.parametros.map((p) => (
            <tr key={p.destreza}>
              <td className="border border-clinic-gray px-3 py-2">{p.destreza}</td>
              <td className="border border-clinic-gray px-3 py-2 font-semibold">
                {p.valor != null ? `${p.valor}%` : '—'}
              </td>
              <td className="border border-clinic-gray px-3 py-2 text-clinic-blue/70">
                {interpreta(p.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Observaciones de la Doctora (IA) */}
      <h2 className="text-sm font-bold text-clinic-blue uppercase tracking-wide mb-2">
        Observaciones de la Doctora
      </h2>
      <div className="text-sm text-clinic-blue/85 mb-8">
        {data.analisis ? <ChatMarkdown content={data.analisis} /> : <p>Sin observaciones.</p>}
      </div>

      {/* Pie */}
      <footer className="border-t border-clinic-gray pt-4 text-xs text-clinic-blue/50">
        <p>
          Informe orientativo generado por la Clínica Cultural y Lingüística de Español. El nivel
          oral y la expresión escrita se validan en una sesión presencial con un docente.
        </p>
        <p className="mt-1">Clínica Cultural y Lingüística · Universidad de Granada · 2026</p>
      </footer>
    </article>
  );
}
