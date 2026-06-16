'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface MCQ {
  q: string;
  options: string[];
  answer: number;
}

// ── Contenido del diagnóstico ────────────────────────────────────────────────
const GRAMATICA: MCQ[] = [
  { q: '¿Cómo ___ llamas?', options: ['te', 'se', 'me', 'le'], answer: 0 },
  { q: 'Ayer ___ al cine con mis amigos.', options: ['voy', 'fui', 'iré', 'iba'], answer: 1 },
  { q: 'Quiero que tú ___ más despacio.', options: ['hablas', 'hablar', 'hables', 'hablabas'], answer: 2 },
  { q: 'Si ___ dinero, viajaría por el mundo.', options: ['tengo', 'tuviera', 'tendré', 'tenía'], answer: 1 },
  { q: 'El libro ___ que te hablé es muy bueno.', options: ['que', 'del', 'cuyo', 'del que'], answer: 3 },
  { q: 'No creo que ___ verdad.', options: ['es', 'sea', 'será', 'era'], answer: 1 },
  { q: 'Cuando ___ a casa, llámame.', options: ['llegas', 'llegues', 'llegarás', 'llegaste'], answer: 1 },
  { q: '___ terminado el trabajo antes de las cinco.', options: ['He', 'Había', 'Habré', 'Haya'], answer: 2 },
  { q: 'Me molesta que la gente ___ tarde.', options: ['llega', 'llegue', 'llegará', 'llegaba'], answer: 1 },
  { q: 'De haberlo sabido, no ___ venido.', options: ['habría', 'había', 'haya', 'hubiera'], answer: 0 },
];

const AUDITIVA = {
  texto:
    'Hola, me llamo Lucía y vivo en Granada desde hace tres años. Trabajo por las mañanas en una librería del centro y por las tardes estudio italiano. Los fines de semana me gusta pasear por el Albaicín y tomar algo con mis amigos en una terraza con vistas a la Alhambra.',
  preguntas: [
    { q: '¿Cuánto tiempo hace que Lucía vive en Granada?', options: ['Un año', 'Tres años', 'Cinco años', 'Toda la vida'], answer: 1 },
    { q: '¿Dónde trabaja Lucía?', options: ['En un bar', 'En una escuela', 'En una librería', 'En un hotel'], answer: 2 },
    { q: '¿Qué estudia por las tardes?', options: ['Inglés', 'Italiano', 'Francés', 'Alemán'], answer: 1 },
    { q: '¿Qué hace los fines de semana?', options: ['Trabaja más', 'Pasea por el Albaicín', 'Viaja a Madrid', 'Estudia en casa'], answer: 1 },
  ] as MCQ[],
};

const LECTORA = {
  texto:
    'La tradición de las tapas en Granada es muy especial: en la mayoría de los bares, cuando pides una bebida, te sirven gratis una pequeña ración de comida. Esta costumbre, cada vez menos frecuente en otras ciudades españolas, convierte el "tapeo" en una forma económica y social de cenar. Muchos estudiantes internacionales descubren así platos típicos sin gastar mucho dinero.',
  preguntas: [
    { q: 'Según el texto, en Granada la tapa con la bebida suele ser…', options: ['carísima', 'gratis', 'obligatoria pagarla', 'solo de postre'], answer: 1 },
    { q: 'Esta costumbre, en otras ciudades, es…', options: ['más frecuente', 'igual de común', 'cada vez menos frecuente', 'desconocida'], answer: 2 },
    { q: 'El "tapeo" se describe como una forma de cenar…', options: ['cara y formal', 'económica y social', 'rápida y solitaria', 'solo para turistas'], answer: 1 },
    { q: '¿Quiénes descubren platos típicos sin gastar mucho?', options: ['Los cocineros', 'Los estudiantes internacionales', 'Los camareros', 'Los políticos'], answer: 1 },
  ] as MCQ[],
};

const SECCIONES = ['Gramática', 'Auditiva', 'Lectora', 'Escrita'] as const;

export default function DiagnosticoTest() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [gram, setGram] = useState<number[]>(Array(GRAMATICA.length).fill(-1));
  const [aud, setAud] = useState<number[]>(Array(AUDITIVA.preguntas.length).fill(-1));
  const [lec, setLec] = useState<number[]>(Array(LECTORA.preguntas.length).fill(-1));
  const [texto, setTexto] = useState('');
  const [escuchas, setEscuchas] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const escuchar = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Tu navegador no admite audio. Usa Chrome/Edge.');
      return;
    }
    if (escuchas >= 2) {
      toast('Solo puedes escuchar el audio 2 veces 🙂', { icon: '🎧' });
      return;
    }
    const u = new SpeechSynthesisUtterance(AUDITIVA.texto);
    u.lang = 'es-ES';
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setEscuchas((n) => n + 1);
  };

  const aciertos = (sel: number[], qs: MCQ[]) =>
    sel.reduce((acc, s, i) => acc + (s === qs[i].answer ? 1 : 0), 0);

  const finalizar = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gramatica: { correct: aciertos(gram, GRAMATICA), total: GRAMATICA.length },
          auditiva: { correct: aciertos(aud, AUDITIVA.preguntas), total: AUDITIVA.preguntas.length },
          lectora: { correct: aciertos(lec, LECTORA.preguntas), total: LECTORA.preguntas.length },
          escrita: { texto },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`¡Diagnóstico completado! Nivel ${data.level}`);
      router.refresh();
    } catch {
      toast.error('No pudimos guardar tu diagnóstico.');
      setSubmitting(false);
    }
  };

  const McqList = ({
    qs,
    sel,
    onPick,
  }: {
    qs: MCQ[];
    sel: number[];
    onPick: (qi: number, oi: number) => void;
  }) => (
    <div className="space-y-5">
      {qs.map((question, qi) => (
        <div key={qi}>
          <p className="font-medium text-clinic-blue mb-2">
            {qi + 1}. {question.q}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {question.options.map((opt, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => onPick(qi, oi)}
                className={`text-left px-4 py-2 rounded-lg border text-sm transition ${
                  sel[qi] === oi
                    ? 'border-clinic-red bg-clinic-red/5 text-clinic-blue font-semibold'
                    : 'border-clinic-gray text-clinic-blue/80 hover:border-clinic-red'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8 animate-fade-in">
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {SECCIONES.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= step ? 'bg-clinic-red' : 'bg-clinic-gray'}`}
            />
            <p
              className={`text-xs mt-1 ${i === step ? 'text-clinic-red font-semibold' : 'text-clinic-blue/40'}`}
            >
              {s}
            </p>
          </div>
        ))}
      </div>

      {submitting ? (
        <p className="text-center py-12 text-clinic-blue/60">Calculando tu diagnóstico…</p>
      ) : (
        <>
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-clinic-blue mb-1">Gramática</h2>
              <p className="text-clinic-blue/60 text-sm mb-6">Elige la opción correcta.</p>
              <McqList
                qs={GRAMATICA}
                sel={gram}
                onPick={(qi, oi) => setGram((p) => p.map((v, i) => (i === qi ? oi : v)))}
              />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-clinic-blue mb-1">Comprensión auditiva</h2>
              <p className="text-clinic-blue/60 text-sm mb-4">
                Escucha el audio (máx. 2 veces) y responde. No verás el texto.
              </p>
              <button
                type="button"
                onClick={escuchar}
                className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 bg-clinic-green text-white rounded-lg font-semibold hover:bg-clinic-green/90"
              >
                ▶ Escuchar audio {escuchas > 0 && `(${2 - escuchas} restantes)`}
              </button>
              <McqList
                qs={AUDITIVA.preguntas}
                sel={aud}
                onPick={(qi, oi) => setAud((p) => p.map((v, i) => (i === qi ? oi : v)))}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-clinic-blue mb-1">Comprensión lectora</h2>
              <p className="text-clinic-blue/60 text-sm mb-4">Lee el texto y responde.</p>
              <div className="bg-clinic-gray/30 rounded-xl p-4 text-clinic-blue/80 text-sm mb-6">
                {LECTORA.texto}
              </div>
              <McqList
                qs={LECTORA.preguntas}
                sel={lec}
                onPick={(qi, oi) => setLec((p) => p.map((v, i) => (i === qi ? oi : v)))}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-clinic-blue mb-1">Expresión escrita</h2>
              <p className="text-clinic-blue/60 text-sm mb-4">
                Escribe un texto (4-6 frases): preséntate y cuenta por qué quieres aprender español
                en Granada. Lo revisará un docente junto a tu evaluación oral.
              </p>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={7}
                placeholder="Escribe aquí tu texto…"
                className="w-full px-4 py-3 border border-clinic-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinic-red/40"
              />
              <p className="text-xs text-clinic-blue/40 mt-1">
                {texto.trim().split(/\s+/).filter(Boolean).length} palabras
              </p>
            </>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-lg border border-clinic-gray text-clinic-blue/70 disabled:opacity-40 hover:bg-clinic-gray/40"
            >
              Atrás
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 bg-clinic-red text-white rounded-lg font-semibold hover:bg-clinic-red/90"
              >
                Siguiente sección
              </button>
            ) : (
              <button
                type="button"
                onClick={finalizar}
                disabled={texto.trim().length < 10}
                className="px-6 py-2.5 bg-clinic-green text-white rounded-lg font-bold hover:bg-clinic-green/90 disabled:opacity-50"
              >
                Finalizar diagnóstico
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
