'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface RecursoView {
  id: string;
  titulo: string;
  tipo: string;
  formato: string;
  nivel: string;
  duracionMin: number;
  descripcion: string;
  contenido: string;
  url?: string;
  lexico?: Record<string, string>;
}

const DOSIS = [
  ['pildora', 'Píldora'],
  ['jarabe', 'Jarabe'],
  ['pomada', 'Pomada'],
  ['inyeccion', 'Inyección'],
];
const FORMATOS = [
  ['texto', 'Lectura'],
  ['ejercicio', 'Ejercicio'],
  ['video', 'Vídeo'],
  ['audio', 'Audio'],
  ['interactivo', 'Interactivo'],
];
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function lexicoATexto(lexico?: Record<string, string>): string {
  if (!lexico) return '';
  return Object.entries(lexico)
    .map(([k, v]) => `${k} = ${v}`)
    .join('\n');
}

function textoALexico(texto: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const linea of texto.split('\n')) {
    const i = linea.indexOf('=');
    if (i === -1) continue;
    const k = linea.slice(0, i).trim();
    const v = linea.slice(i + 1).trim();
    if (k && v) out[k] = v;
  }
  return out;
}

export default function RecursoForm({
  farmaciaId,
  recurso,
  onDone,
}: {
  farmaciaId: string;
  recurso?: RecursoView;
  onDone: () => void;
}) {
  const router = useRouter();
  const editar = Boolean(recurso?.id);
  const [titulo, setTitulo] = useState(recurso?.titulo ?? '');
  const [tipo, setTipo] = useState(recurso?.tipo ?? 'pildora');
  const [formato, setFormato] = useState(recurso?.formato ?? 'texto');
  const [nivel, setNivel] = useState(recurso?.nivel || 'B1');
  const [duracionMin, setDuracionMin] = useState(recurso?.duracionMin ?? 5);
  const [descripcion, setDescripcion] = useState(recurso?.descripcion ?? '');
  const [contenido, setContenido] = useState(recurso?.contenido ?? '');
  const [url, setUrl] = useState(recurso?.url ?? '');
  const [lexicoText, setLexicoText] = useState(lexicoATexto(recurso?.lexico));
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim().length < 1) {
      toast.error('Ponle un título al recurso.');
      return;
    }
    setLoading(true);
    try {
      const body = {
        ...(editar ? { id: recurso!.id } : { farmaciaId }),
        title: titulo,
        dosis: tipo,
        formato,
        nivel,
        duracionMin: Number(duracionMin) || 0,
        descripcion,
        contenido,
        url,
        lexico: textoALexico(lexicoText),
      };
      const res = await fetch('/api/admin/recursos', {
        method: editar ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'No se pudo guardar.');
      }
      toast.success(editar ? 'Recurso actualizado.' : 'Recurso creado.');
      onDone();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full px-3 py-2 border border-clinic-gray rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';
  const label = 'text-clinic-blue font-semibold text-xs mb-1 block';

  return (
    <form onSubmit={submit} className="bg-clinic-gray/20 border border-clinic-gray rounded-xl p-4 space-y-3 mt-3">
      <div>
        <label className={label}>Título *</label>
        <input className={input} value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className={label}>Dosis</label>
          <select className={input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {DOSIS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Formato</label>
          <select className={input} value={formato} onChange={(e) => setFormato(e.target.value)}>
            {FORMATOS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Nivel</label>
          <select className={input} value={nivel} onChange={(e) => setNivel(e.target.value)}>
            {NIVELES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Minutos</label>
          <input
            type="number"
            className={input}
            value={duracionMin}
            onChange={(e) => setDuracionMin(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>
      <div>
        <label className={label}>Descripción (resumen corto)</label>
        <input className={input} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </div>
      <div>
        <label className={label}>Contenido (markdown)</label>
        <textarea
          className={`${input} font-mono`}
          rows={8}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="## Título\n\nTu lectura en markdown…"
        />
      </div>
      <div>
        <label className={label}>Léxico (una palabra por línea: «palabra = definición»)</label>
        <textarea
          className={`${input} font-mono`}
          rows={4}
          value={lexicoText}
          onChange={(e) => setLexicoText(e.target.value)}
          placeholder="dinastía = Serie de reyes de una misma familia. // Los nazaríes fueron una dinastía."
        />
      </div>
      <div>
        <label className={label}>Enlace externo (opcional)</label>
        <input className={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-clinic-red text-white text-sm font-semibold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50"
        >
          {loading ? 'Guardando…' : editar ? 'Guardar' : 'Crear recurso'}
        </button>
        <button type="button" onClick={onDone} className="px-4 py-2 text-clinic-blue/50 text-sm hover:text-clinic-blue">
          Cancelar
        </button>
      </div>
    </form>
  );
}
