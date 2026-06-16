'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error');

      setSubmitted(true);
      // En desarrollo (sin Resend) devolvemos el enlace para poder probar.
      if (data.devMagicLink) setDevLink(data.devMagicLink);
      toast.success('¡Revisa tu email!');
    } catch {
      toast.error('No pudimos enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clinic-gray/40 px-4">
        <div className="bg-white p-8 rounded-2xl border border-clinic-gray max-w-md w-full text-center shadow-sm animate-fade-in">
          <div className="text-5xl mb-4">📨</div>
          <h2 className="text-2xl font-bold text-clinic-green mb-3">¡Revisa tu email!</h2>
          <p className="text-clinic-blue/60 mb-6">
            Enviamos un enlace mágico a <strong>{email}</strong>. Caduca en 15 minutos.
          </p>

          {devLink && (
            <div className="mb-6 text-left bg-clinic-gray/40 rounded-lg p-4">
              <p className="text-xs text-clinic-blue/60 mb-2">
                Modo desarrollo (Resend sin configurar). Usa este enlace:
              </p>
              <a href={devLink} className="text-clinic-red text-sm break-all underline">
                {devLink}
              </a>
            </div>
          )}

          <Link href="/" className="text-clinic-red hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-gray/40 px-4">
      <div className="bg-white p-8 rounded-2xl border border-clinic-gray max-w-md w-full shadow-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏥</div>
          <h1 className="text-2xl font-bold text-clinic-red">Clínica Cultural</h1>
          <p className="text-clinic-blue/60">Sala de Diagnóstico LC</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-6">
            <span className="text-clinic-blue font-semibold mb-2 block">Tu email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 border border-clinic-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinic-red/40 focus:border-clinic-red"
              placeholder="tu.email@ejemplo.com"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-clinic-red text-white font-bold rounded-lg hover:bg-clinic-red/90 disabled:opacity-50 transition"
          >
            {loading ? 'Enviando…' : 'Recibir Enlace Mágico'}
          </button>
        </form>

        <p className="text-center text-clinic-blue/50 text-sm mt-6">
          No necesitas contraseña. Solo recibimos un enlace seguro.
        </p>
      </div>
    </div>
  );
}
