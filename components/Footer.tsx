'use client';

import Link from 'next/link';
import { useState } from 'react';

// Guiño de "Por 2 duros": frases que cambian cada vez que pasas el ratón.
const FRASES = [
  'Hecho con más cariño que presupuesto.',
  'A base de café, tapas y subjuntivos.',
  'Si funciona, fue queriendo.',
  'Por 2 duros y una caña, oiga.',
  'Bugs con denominación de origen.',
  'Programado en Graná, con su solera.',
  'Cada píxel, recetado por el doctor.',
  'Más barato que un duro, más bonito que la Alhambra.',
  'Diagnóstico: web con mucho arte.',
  '¿Un duro? Mejor dos, que es viernes.',
];

export default function Footer() {
  const [frase, setFrase] = useState(FRASES[0]);

  const nuevaFrase = () => {
    setFrase((actual) => {
      let f = actual;
      // evita repetir la misma seguida
      while (f === actual && FRASES.length > 1) {
        f = FRASES[Math.floor(Math.random() * FRASES.length)];
      }
      return f;
    });
  };

  return (
    <footer className="bg-clinic-blue text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* Marca */}
        <div>
          <p className="font-heading text-lg">Clínica Cultural y Lingüística de Español</p>
          <p className="text-white/60 text-sm mt-1">Universidad de Granada · 2026</p>
        </div>

        {/* Legal */}
        <nav className="flex flex-col gap-2 text-sm">
          <span className="uppercase text-xs tracking-wider text-white/40 mb-1">Legal</span>
          <Link href="/legal/privacidad" className="text-white/80 hover:text-white transition">
            Política de privacidad
          </Link>
          <Link href="/legal/terminos" className="text-white/80 hover:text-white transition">
            Términos y condiciones
          </Link>
          <Link href="/legal/cookies" className="text-white/80 hover:text-white transition">
            Política de cookies
          </Link>
          <Link href="/legal/aviso-legal" className="text-white/80 hover:text-white transition">
            Aviso legal (RGPD)
          </Link>
        </nav>

        {/* Desarrollo + guiño */}
        <div className="text-sm">
          <span className="uppercase text-xs tracking-wider text-white/40 mb-1 block">Desarrollo</span>
          <a
            href="https://pordosduros.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={nuevaFrase}
            className="group inline-flex flex-col gap-1"
          >
            <span className="text-white/80 group-hover:text-white transition">
              Desarrollado por{' '}
              <strong className="text-clinic-gold">Por 2 duros</strong> ·{' '}
              <span className="underline decoration-clinic-gold/40">pordosduros.com</span>
            </span>
            <span className="text-white/50 italic min-h-[1.25rem] opacity-70 group-hover:opacity-100 transition">
              “{frase}”
            </span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Clínica Cultural y Lingüística de Español · Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
