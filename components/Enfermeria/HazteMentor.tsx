'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function HazteMentor({ nombre, idioma }: { nombre: string; idioma: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(nombre);
  const [nativeLanguage, setNativeLanguage] = useState(idioma);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      toast.error('Indica tu nombre completo.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, nativeLanguage, bio }),
      });
      if (!res.ok) throw new Error();
      toast.success('¡Ya eres mentor/a! Bienvenido/a al programa.');
      router.refresh();
    } catch {
      toast.error('No se pudo completar. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-green/40 focus:border-clinic-green';

  return (
    <div className="bg-clinic-green/5 border border-clinic-green/30 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-clinic-blue flex items-center gap-2">
            🌍 ¿Vives en Granada?
          </h3>
          <p className="text-clinic-blue/60 text-sm">
            Únete como <strong>mentor/a</strong>: acompaña a un estudiante internacional, practica su
            idioma y consigue tu <strong>tarjeta del Seguro LC</strong> con un{' '}
            <strong>20% de descuento</strong> en actividades culturales.
          </p>
        </div>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold whitespace-nowrap hover:bg-clinic-green/90"
          >
            Quiero ser mentor/a
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-4 border-t border-clinic-green/20 pt-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Nombre completo *</label>
              <input
                className={input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre y apellidos"
                required
              />
            </div>
            <div>
              <label className={label}>Idiomas que hablas</label>
              <input
                className={input}
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                placeholder="p. ej. Español, inglés"
              />
            </div>
          </div>
          <div>
            <label className={label}>Intereses y disponibilidad</label>
            <textarea
              className={input}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos tus intereses (cine, senderismo, tapas…) y cuándo te viene bien quedar."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-clinic-green text-white font-bold rounded-lg hover:bg-clinic-green/90 disabled:opacity-50"
            >
              {loading ? 'Activando…' : 'Hacerme mentor/a'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-clinic-blue/50 hover:text-clinic-blue text-sm font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
