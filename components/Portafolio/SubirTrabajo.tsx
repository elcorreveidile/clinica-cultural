'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';

const TIPOS = [
  { value: 'writing', label: '✍️ Escritura' },
  { value: 'audio', label: '🎧 Audio' },
  { value: 'video', label: '🎬 Vídeo' },
  { value: 'miniseries_episode', label: '📺 Mini serie' },
  { value: 'project', label: '📦 Proyecto' },
];

export default function SubirTrabajo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('writing');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [enlace, setEnlace] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setContentType('writing');
    setDescription('');
    setFile(null);
    setEnlace('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 1) {
      toast.error('Ponle un título a tu trabajo.');
      return;
    }
    setLoading(true);
    try {
      let fileUrl = enlace.trim();
      if (file) {
        const safeName = file.name.replace(/[^\w.\-]+/g, '_');
        const blob = await upload(`portafolio/${Date.now()}-${safeName}`, file, {
          access: 'public',
          handleUploadUrl: '/api/portafolio/upload',
        });
        fileUrl = blob.url;
      }
      const res = await fetch('/api/portafolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, contentType, description, fileUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'No se pudo guardar el trabajo.');
      }
      toast.success('Trabajo añadido a tu portafolio.');
      reset();
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo subir el trabajo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90"
      >
        ➕ Subir un trabajo
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-clinic-blue">Subir un trabajo</h2>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-clinic-blue/50 hover:text-clinic-blue text-sm"
        >
          Cancelar
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Título *</label>
          <input
            className={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="p. ej. Mi poema sobre Granada"
            required
          />
        </div>
        <div>
          <label className={label}>Tipo</label>
          <select className={input} value={contentType} onChange={(e) => setContentType(e.target.value)}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Descripción o texto</label>
        <textarea
          className={input}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe aquí tu texto, o describe el trabajo que adjuntas…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Archivo (opcional)</label>
          <input
            type="file"
            accept="image/*,application/pdf,audio/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-clinic-blue/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-clinic-gray/60 file:text-clinic-blue file:font-semibold hover:file:bg-clinic-gray"
          />
          <p className="text-xs text-clinic-blue/40 mt-1">Imagen, PDF, audio o vídeo (hasta 200 MB).</p>
        </div>
        <div>
          <label className={label}>…o enlace externo</label>
          <input
            className={input}
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            placeholder="https://… (Drive, YouTube…)"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-clinic-red text-white font-bold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 transition"
      >
        {loading ? 'Subiendo…' : 'Añadir al portafolio'}
      </button>
    </form>
  );
}
