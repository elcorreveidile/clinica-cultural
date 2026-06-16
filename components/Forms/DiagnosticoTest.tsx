'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Question {
  q: string;
  options: string[];
  answer: number;
}

// Muestra reducida de la batería de diagnóstico (el documento prevé ~40).
const QUESTIONS: Question[] = [
  { q: '¿Cómo ___ llamas?', options: ['te', 'se', 'me', 'le'], answer: 0 },
  { q: 'Ayer ___ al cine con mis amigos.', options: ['voy', 'fui', 'iré', 'iba'], answer: 1 },
  { q: 'Quiero que tú ___ más despacio.', options: ['hablas', 'hablar', 'hables', 'hablabas'], answer: 2 },
  { q: 'Si ___ dinero, viajaría por el mundo.', options: ['tengo', 'tuviera', 'tendré', 'tenía'], answer: 1 },
  { q: 'El libro ___ que te hablé es muy bueno.', options: ['que', 'del', 'cuyo', 'del que'], answer: 3 },
  { q: 'No creo que ___ verdad.', options: ['es', 'sea', 'será', 'era'], answer: 1 },
  { q: 'Cuando ___ a casa, llámame.', options: ['llegas', 'llegues', 'llegarás', 'llegaste'], answer: 1 },
  { q: '___ terminado el trabajo antes de las cinco.', options: ['He', 'Había', 'Habré', 'Haya'], answer: 2 },
];

export default function DiagnosticoTest() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const choose = async (idx: number) => {
    const updated = [...answers, idx];
    setAnswers(updated);

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      return;
    }

    // Última pregunta → calcular y enviar
    setSubmitting(true);
    const correct = updated.reduce(
      (acc, a, i) => acc + (a === QUESTIONS[i].answer ? 1 : 0),
      0
    );

    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct, total: QUESTIONS.length }),
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

  const question = QUESTIONS[current];
  const progress = Math.round((current / QUESTIONS.length) * 100);

  return (
    <div className="bg-white border border-clinic-gray rounded-2xl p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-clinic-blue/60 mb-2">
          <span>
            Pregunta {current + 1} de {QUESTIONS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-clinic-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-clinic-red transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {submitting ? (
        <p className="text-center py-12 text-clinic-blue/60">
          Calculando tu diagnóstico…
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold text-clinic-blue mb-6">{question.q}</h2>
          <div className="grid gap-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className="text-left px-5 py-3 rounded-xl border border-clinic-gray hover:border-clinic-red hover:bg-clinic-red/5 transition font-medium text-clinic-blue"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
