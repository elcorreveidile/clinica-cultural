'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ReservarSesion({
  tipo,
  tutorNombre,
  disponibles,
}: {
  tipo: 'mentor' | 'professor';
  tutorNombre: string;
  disponibles?: number; // solo aplica a la vía mentor (cupo del Seguro LC)
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const esMentor = tipo === 'mentor';
  // Clases completas (Tailwind no detecta nombres de clase construidos dinámicamente).
  const btnBg = esMentor
    ? 'bg-clinic-red hover:bg-clinic-red/90'
    : 'bg-clinic-gold hover:bg-clinic-gold/90';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate) {
      toast.error('Elige una fecha y hora.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/tutoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, scheduledDate, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(
        esMentor ? 'Sesión reservada. ¡Te esperamos!' : 'Solicitud enviada. Un profesor la confirmará.'
      );
      setScheduledDate('');
      setNotes('');
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo reservar la sesión.');
      setLoading(false);
    }
  };

  if (esMentor && (disponibles ?? 0) <= 0) {
    return (
      <div className="bg-clinic-gold/10 border border-clinic-gold/30 rounded-2xl p-5 text-sm text-clinic-blue/70">
        Has agotado las sesiones de tutoría con tu pareja. Habla con tu tutor o el equipo para ampliar
        tu plan.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 ${btnBg} text-white rounded-lg font-semibold`}
      >
        📅 {esMentor ? `Reservar con ${tutorNombre}` : 'Reservar con un profesor'}
      </button>
    );
  }

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  return (
    <form onSubmit={submit} className="bg-white border border-clinic-gray rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-clinic-blue">
          {esMentor ? `Reservar con ${tutorNombre}` : 'Reservar con un profesor'}
        </h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-clinic-blue/50 hover:text-clinic-blue text-sm"
        >
          Cancelar
        </button>
      </div>

      <div>
        <label className={label}>Fecha y hora *</label>
        <input
          type="datetime-local"
          className={input}
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={label}>¿Qué quieres trabajar? (opcional)</label>
        <textarea
          className={input}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="p. ej. Practicar para una presentación, dudas con el subjuntivo…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 ${btnBg} text-white font-bold rounded-lg disabled:opacity-50 transition`}
      >
        {loading ? 'Enviando…' : esMentor ? 'Confirmar reserva' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
