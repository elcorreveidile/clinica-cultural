'use client';

import { useEffect, useRef, useState } from 'react';

// Construye el enlace al Diccionario de la lengua española (RAE).
// Quita el artículo inicial (el, la, los…) y usa la primera palabra.
function raeUrl(palabra: string): string {
  const sinArticulo = palabra.replace(/^(el|la|los|las|lo|un|una|unos|unas)\s+/i, '');
  const primera = sinArticulo.trim().split(/\s+/)[0];
  return `https://dle.rae.es/?w=${encodeURIComponent(primera)}`;
}

export default function LexicoChip({
  palabra,
  definicion,
}: {
  palabra: string;
  definicion: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Cerrar al pulsar fuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    function onClickFuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false);
    }
    document.addEventListener('mousedown', onClickFuera);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickFuera);
      document.removeEventListener('keydown', onKey);
    };
  }, [abierto]);

  const sentidos = definicion
    .split('//')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        onMouseEnter={() => setAbierto(true)}
        aria-expanded={abierto}
        className={`px-2.5 py-1 rounded-full text-sm font-medium transition cursor-help border ${
          abierto
            ? 'bg-clinic-gold/25 border-clinic-gold text-clinic-blue'
            : 'bg-clinic-gray/60 border-transparent text-clinic-blue hover:bg-clinic-gold/20'
        }`}
      >
        {palabra}
      </button>

      {abierto && (
        <span
          role="tooltip"
          onMouseLeave={() => setAbierto(false)}
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 max-w-[80vw] block text-left bg-clinic-blue text-white rounded-xl shadow-xl p-3 text-sm leading-snug"
        >
          <span className="block font-bold text-clinic-gold mb-1">{palabra}</span>
          {sentidos.length > 1 ? (
            <span className="block space-y-1">
              {sentidos.map((s, i) => (
                <span key={i} className="block">
                  <span className="text-clinic-gold/80 font-semibold mr-1">{i + 1}.</span>
                  {s}
                </span>
              ))}
            </span>
          ) : (
            <span className="block">{sentidos[0]}</span>
          )}
          <a
            href={raeUrl(palabra)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 mt-2 text-clinic-gold underline font-semibold"
          >
            Ver en la RAE ↗
          </a>
          {/* Flecha del tooltip */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full -mt-px border-8 border-transparent border-t-clinic-blue" />
        </span>
      )}
    </span>
  );
}
