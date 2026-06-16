'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Construye el enlace al Diccionario de la lengua española (RAE).
// Quita el artículo inicial (el, la, los…) y usa la primera palabra.
function raeUrl(palabra: string): string {
  const sinArticulo = palabra.replace(/^(el|la|los|las|lo|un|una|unos|unas)\s+/i, '');
  const primera = sinArticulo.trim().split(/\s+/)[0];
  return `https://dle.rae.es/?w=${encodeURIComponent(primera)}`;
}

interface Coords {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
  arrowLeft: number;
}

export default function LexicoChip({
  palabra,
  definicion,
}: {
  palabra: string;
  definicion: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sentidos = definicion
    .split('//')
    .map((s) => s.trim())
    .filter(Boolean);

  // Calcula la posición fija del tooltip a partir del botón, sin salirse de
  // la ventana (evita que el texto se corte en las tarjetas de los extremos).
  const actualizarPos = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const margen = 8;
    const width = Math.min(288, vw - margen * 2);
    const centro = rect.left + rect.width / 2;
    let left = centro - width / 2;
    left = Math.max(margen, Math.min(left, vw - width - margen));
    // Por defecto arriba; si no hay sitio (cerca del borde superior), abajo.
    const placement: 'top' | 'bottom' = rect.top > 200 ? 'top' : 'bottom';
    const arrowLeft = Math.max(14, Math.min(centro - left, width - 14));
    setCoords({
      top: placement === 'top' ? rect.top : rect.bottom,
      left,
      width,
      placement,
      arrowLeft,
    });
  }, []);

  const cancelarCierre = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const abrir = useCallback(() => {
    cancelarCierre();
    actualizarPos();
    setAbierto(true);
  }, [actualizarPos, cancelarCierre]);

  // Pequeña demora para poder cruzar el hueco entre la tarjeta y el tooltip
  // sin que parpadee; al entrar en cualquiera de los dos se cancela.
  const programarCierre = useCallback(() => {
    cancelarCierre();
    closeTimer.current = setTimeout(() => setAbierto(false), 120);
  }, [cancelarCierre]);

  // Cerrar al pulsar fuera, con Escape, y reposicionar/cerrar al hacer scroll.
  useEffect(() => {
    if (!abierto) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || tipRef.current?.contains(t)) return;
      setAbierto(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false);
    }
    function onScroll() {
      setAbierto(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', actualizarPos);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', actualizarPos);
    };
  }, [abierto, actualizarPos]);

  // Limpieza del temporizador al desmontar.
  useEffect(() => () => cancelarCierre(), [cancelarCierre]);

  return (
    <span className="inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onMouseEnter={abrir}
        onMouseLeave={programarCierre}
        onFocus={abrir}
        onBlur={programarCierre}
        aria-expanded={abierto}
        className={`px-2.5 py-1 rounded-full text-sm font-medium transition cursor-help border ${
          abierto
            ? 'bg-clinic-gold/25 border-clinic-gold text-clinic-blue'
            : 'bg-clinic-gray/60 border-transparent text-clinic-blue hover:bg-clinic-gold/20'
        }`}
      >
        {palabra}
      </button>

      {abierto &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            ref={tipRef}
            role="tooltip"
            onMouseEnter={cancelarCierre}
            onMouseLeave={programarCierre}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transform:
                coords.placement === 'top'
                  ? 'translateY(calc(-100% - 8px))'
                  : 'translateY(8px)',
            }}
            className="z-[100] block text-left bg-clinic-blue text-white rounded-xl shadow-xl p-3 text-sm leading-snug"
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
            {/* Flecha del tooltip, apuntando a la tarjeta */}
            <span
              style={{ left: coords.arrowLeft }}
              className={`absolute -translate-x-1/2 border-8 border-transparent ${
                coords.placement === 'top'
                  ? 'top-full -mt-px border-t-clinic-blue'
                  : 'bottom-full -mb-px border-b-clinic-blue'
              }`}
            />
          </span>,
          document.body
        )}
    </span>
  );
}
