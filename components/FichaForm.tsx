'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface FichaInicial {
  fullName: string;
  nationality: string;
  nativeLanguage: string;
  dateOfBirth: string; // yyyy-mm-dd
  phone: string;
  bio: string;
  profilePictureUrl: string; // data URL de la foto, o ''
}

export default function FichaForm({
  inicial,
  redirectTo = '/dashboard',
  submitLabel = 'Completar ficha y entrar',
}: {
  inicial: FichaInicial;
  redirectTo?: string | null;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [f, setF] = useState<FichaInicial>(inicial);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FichaInicial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  // Lee la imagen elegida, la recorta a un cuadrado y la comprime en el
  // navegador para que ocupe poco antes de guardarla.
  const onFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 320;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setF((p) => ({ ...p, profilePictureUrl: dataUrl }));
      };
      img.onerror = () => toast.error('No pudimos leer la imagen.');
      img.src = reader.result as string;
    };
    reader.onerror = () => toast.error('No pudimos leer la imagen.');
    reader.readAsDataURL(file);
  };

  const quitarFoto = () => setF((p) => ({ ...p, profilePictureUrl: '' }));

  const iniciales = f.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.fullName.trim().length < 2) {
      toast.error('Indica tu nombre completo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      toast.success(redirectTo ? '¡Ficha completada! Bienvenido/a a la Clínica.' : 'Cambios guardados.');
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error('No pudimos guardar tu ficha. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label}>Fotografía</label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-clinic-gray/60 border border-clinic-gray flex items-center justify-center text-clinic-blue/50 font-bold text-xl shrink-0">
            {f.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.profilePictureUrl} alt="Tu foto" className="h-full w-full object-cover" />
            ) : (
              <span>{iniciales || '🙂'}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer px-4 py-2 border border-clinic-red text-clinic-red rounded-lg text-sm font-semibold hover:bg-clinic-red/5">
              {f.profilePictureUrl ? 'Cambiar foto' : 'Subir foto'}
              <input type="file" accept="image/*" onChange={onFoto} className="hidden" />
            </label>
            {f.profilePictureUrl && (
              <button
                type="button"
                onClick={quitarFoto}
                className="px-4 py-2 border border-clinic-gray text-clinic-blue/70 rounded-lg text-sm font-semibold hover:bg-clinic-gray/40"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-clinic-blue/40 mt-1">La imagen se recorta en cuadrado. Opcional.</p>
      </div>

      <div>
        <label className={label}>Nombre completo *</label>
        <input className={input} value={f.fullName} onChange={set('fullName')} required placeholder="Nombre y apellidos" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nacionalidad</label>
          <input className={input} value={f.nationality} onChange={set('nationality')} placeholder="p. ej. Italiana" />
        </div>
        <div>
          <label className={label}>Lengua materna</label>
          <input className={input} value={f.nativeLanguage} onChange={set('nativeLanguage')} placeholder="p. ej. Italiano" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Fecha de nacimiento</label>
          <input type="date" className={input} value={f.dateOfBirth} onChange={set('dateOfBirth')} />
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input className={input} value={f.phone} onChange={set('phone')} placeholder="+34 …" />
        </div>
      </div>

      <div>
        <label className={label}>¿Por qué quieres aprender español? ¿Cuáles son tus objetivos?</label>
        <textarea
          className={input}
          rows={4}
          value={f.bio}
          onChange={set('bio')}
          placeholder="Cuéntanos brevemente tu motivación y objetivos…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-clinic-red text-white font-bold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 transition"
      >
        {loading ? 'Guardando…' : submitLabel}
      </button>
    </form>
  );
}
