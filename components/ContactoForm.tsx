'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactoForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2 || mensaje.trim().length < 5) {
      toast.error('Completa tu nombre y un mensaje.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, organizacion, mensaje, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnviado(true);
      toast.success('¡Mensaje enviado! Te responderemos pronto.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  const label = 'text-clinic-blue font-semibold text-sm mb-1 block';
  const input =
    'w-full px-4 py-2.5 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red';

  if (enviado) {
    return (
      <div className="bg-clinic-green/5 border border-clinic-green/30 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-bold text-clinic-blue mb-1">¡Mensaje enviado!</h2>
        <p className="text-clinic-blue/60">
          Gracias por escribirnos. Te responderemos al correo que nos has indicado lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Nombre *</label>
          <input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre" />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input
            type="email"
            className={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
      </div>

      <div>
        <label className={label}>Entidad u organización (opcional)</label>
        <input
          className={input}
          value={organizacion}
          onChange={(e) => setOrganizacion(e.target.value)}
          placeholder="p. ej. Universidad, escuela, empresa…"
        />
      </div>

      <div>
        <label className={label}>Mensaje *</label>
        <textarea
          className={input}
          rows={5}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          placeholder="Cuéntanos en qué te gustaría colaborar o qué necesitas."
        />
      </div>

      {/* Honeypot anti-spam: oculto para personas, tentador para bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-clinic-red text-white font-bold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 transition"
      >
        {loading ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p className="text-xs text-clinic-blue/40 text-center">
        Tus datos se tratan conforme a nuestra{' '}
        <a href="/legal/privacidad" className="underline">
          política de privacidad
        </a>
        .
      </p>
    </form>
  );
}
