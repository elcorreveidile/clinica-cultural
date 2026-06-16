'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Frases clínicas que rotan mientras La Doctora "analiza".
const FRASES_ESPERA = [
  'La Doctora está auscultando tu español… 🩺',
  'Revisando tu radiografía gramatical… 🦴',
  'Analizando las muestras de expresión escrita… 🔬',
  'Tomando la tensión a tus tiempos verbales… 💉',
  'Preparando tu receta lingüística… 💊',
  'Pasando tu texto por el laboratorio… 🧪',
  'Redactando el informe clínico… 📋',
];

interface MCQ {
  q: string;
  options: string[];
  answer: number;
}

// ── Contenido del diagnóstico ────────────────────────────────────────────────
const GRAMATICA: MCQ[] = [
  { q: '¿Cómo ___ llamas?', options: ['te', 'se', 'me', 'le'], answer: 0 },
  { q: 'Yo ___ estudiante de español.', options: ['soy', 'estoy', 'tengo', 'hay'], answer: 0 },
  { q: 'Hay ___ libros en la mesa.', options: ['mucho', 'muchos', 'mucha', 'muchas'], answer: 1 },
  { q: 'Mi hermana ___ veintidós años.', options: ['es', 'está', 'tiene', 'hace'], answer: 2 },
  { q: 'Ayer ___ al cine con mis amigos.', options: ['voy', 'fui', 'iré', 'iba'], answer: 1 },
  { q: 'Esta mañana ___ café antes de salir.', options: ['tomo', 'tomé', 'tomaba', 'he tomado'], answer: 3 },
  { q: 'Cuando era niño, ___ todos los veranos a la playa.', options: ['fui', 'iba', 'iré', 'he ido'], answer: 1 },
  { q: 'Quiero que tú ___ más despacio.', options: ['hablas', 'hablar', 'hables', 'hablabas'], answer: 2 },
  { q: 'Me gusta esta casa, pero ___ es muy cara.', options: ['ese', 'eso', 'esa', 'esta'], answer: 2 },
  { q: 'No creo que ___ verdad.', options: ['es', 'sea', 'será', 'era'], answer: 1 },
  { q: 'Cuando ___ a casa, llámame.', options: ['llegas', 'llegues', 'llegarás', 'llegaste'], answer: 1 },
  { q: 'Si ___ dinero, viajaría por el mundo.', options: ['tengo', 'tuviera', 'tendré', 'tenía'], answer: 1 },
  { q: 'El libro ___ te hablé es muy bueno.', options: ['que', 'del', 'cuyo', 'del que'], answer: 3 },
  { q: '___ terminado el trabajo antes de las cinco.', options: ['He', 'Había', 'Habré', 'Haya'], answer: 2 },
  { q: 'Me molesta que la gente ___ tarde.', options: ['llega', 'llegue', 'llegará', 'llegaba'], answer: 1 },
  { q: 'Te lo dije para que lo ___ en cuenta.', options: ['tienes', 'tengas', 'tuvieras', 'tendrás'], answer: 2 },
  { q: 'Por mucho que ___, no lo conseguirás.', options: ['intentas', 'intentes', 'intentarás', 'intentabas'], answer: 1 },
  { q: 'De haberlo sabido, no ___ venido.', options: ['habría', 'había', 'haya', 'hubiera'], answer: 0 },
  { q: 'Es la persona ___ más confío.', options: ['que', 'en quien', 'cual', 'cuya'], answer: 1 },
  { q: 'Como si ___ algo de lo que pasó…', options: ['sabe', 'supiera', 'sabrá', 'sabía'], answer: 1 },
];

const AUDITIVA = {
  texto:
    'Buenos días. Me llamo Marta y soy profesora de música, aunque ahora mismo no trabajo en ningún colegio, sino que doy clases particulares de piano en mi casa. Antes vivía en Sevilla, pero hace dos años me mudé a Granada por motivos familiares, no por trabajo. Reconozco que al principio no me gustaba nada la ciudad: la encontraba demasiado pequeña y tranquila. Sin embargo, con el tiempo he cambiado de opinión y hoy no me iría de aquí por nada del mundo. Entre semana suelo levantarme tarde, porque mis clases empiezan a mediodía y no terminan hasta las nueve de la noche; por eso el día que más espero es el domingo, cuando por fin puedo desayunar sin prisa. Hace poco he empezado a aprender árabe, y no lo hago porque lo necesite para mi trabajo, sino simplemente porque me apetecía. Lo que peor llevo de Granada es el frío del invierno, que no me esperaba: todos me habían hablado del calor del verano, pero nadie me avisó de las heladas.',
  preguntas: [
    {
      q: '¿A qué se dedica Marta actualmente?',
      options: ['Es profesora en un colegio', 'Da clases particulares de piano', 'Estudia música', 'Trabaja en una academia'],
      answer: 1,
    },
    {
      q: '¿Por qué se mudó a Granada?',
      options: ['Por trabajo', 'Por motivos familiares', 'Para estudiar', 'Por el clima'],
      answer: 1,
    },
    {
      q: '¿Qué opina ahora de la ciudad?',
      options: ['Le sigue pareciendo demasiado tranquila', 'Le encanta y no se iría', 'Quiere volver a Sevilla', 'Le resulta indiferente'],
      answer: 1,
    },
    {
      q: '¿A qué hora terminan sus clases?',
      options: ['A mediodía', 'A las nueve de la noche', 'Por la mañana temprano', 'Los domingos'],
      answer: 1,
    },
    {
      q: '¿Por qué estudia árabe?',
      options: ['Porque lo necesita para su trabajo', 'Porque le apetecía', 'Porque vivió en un país árabe', 'Porque se lo pidió un alumno'],
      answer: 1,
    },
    {
      q: '¿Qué es lo que peor lleva de Granada?',
      options: ['El calor del verano', 'El frío del invierno', 'Que sea pequeña', 'El ruido'],
      answer: 1,
    },
  ] as MCQ[],
};

const LECTORA = {
  texto:
    'La tradición de las tapas en Granada es una de las más queridas por quienes visitan la ciudad. A diferencia de lo que ocurre en buena parte de España, aquí mantiene una característica que la hace única: en la mayoría de los bares, cuando pides una bebida, te sirven gratis una pequeña ración de comida que no eliges tú, sino que decide el camarero. Así, una simple caña puede venir acompañada de una tostada de jamón, un plato de migas o una porción de tortilla.\n\nEsta costumbre, cada vez menos frecuente en otras ciudades españolas, convierte el llamado "tapeo" en una forma económica y profundamente social de cenar: la gente se mueve de bar en bar, comparte mesa con desconocidos y alarga la noche sin gastar apenas dinero. Para muchos estudiantes internacionales, recorrer las tapas no solo es una manera barata de comer, sino también una de las mejores formas de practicar español en situaciones reales y de integrarse en la vida cotidiana granadina. No es de extrañar, por tanto, que el tapeo se haya convertido en todo un símbolo de la identidad de la ciudad.',
  preguntas: [
    { q: 'En Granada, la tapa que acompaña a la bebida…', options: ['la eliges tú', 'la decide el camarero', 'se paga aparte', 'es siempre dulce'], answer: 1 },
    { q: 'Según el texto, esta costumbre en otras ciudades es…', options: ['más frecuente', 'igual de común', 'cada vez menos frecuente', 'totalmente desconocida'], answer: 2 },
    { q: 'El "tapeo" se describe como una forma de cenar…', options: ['cara y formal', 'económica y social', 'rápida y solitaria', 'solo para turistas'], answer: 1 },
    { q: '¿Qué suele hacer la gente durante el tapeo?', options: ['Quedarse en un solo bar', 'Moverse de bar en bar', 'Cenar en casa', 'Comer en silencio'], answer: 1 },
    { q: 'Para los estudiantes internacionales, el tapeo es además una forma de…', options: ['ahorrar para viajar', 'practicar español e integrarse', 'aprender a cocinar', 'conocer a profesores'], answer: 1 },
    { q: 'La idea principal del texto es que el tapeo…', options: ['está desapareciendo en Granada', 'es un símbolo de la identidad de la ciudad', 'solo gusta a los turistas', 'es muy caro'], answer: 1 },
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

  const palabras = texto.trim() ? texto.trim().split(/\s+/).filter(Boolean).length : 0;
  const escritaValida = palabras >= 150 && palabras <= 450;

  const [fraseEspera, setFraseEspera] = useState(0);
  useEffect(() => {
    if (!submitting) return;
    const id = setInterval(
      () => setFraseEspera((n) => (n + 1) % FRASES_ESPERA.length),
      2200
    );
    return () => clearInterval(id);
  }, [submitting]);

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
    u.rate = 0.85; // velocidad natural-pausada
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
      router.replace('/dashboard/diagnostico'); // limpia ?rehacer y muestra resultados
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
        <div className="text-center py-14">
          <div className="text-4xl mb-4 animate-pulse">🩺</div>
          <p className="text-clinic-blue font-semibold">{FRASES_ESPERA[fraseEspera]}</p>
          <p className="text-clinic-blue/50 text-sm mt-2">
            La Doctora está con tu diagnóstico. Esto puede tardar unos segundos…
          </p>
        </div>
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
                Escribe un texto de <strong>150–450 palabras</strong>: preséntate, cuenta por qué
                quieres aprender español en Granada y describe tus objetivos. La inteligencia
                artificial corregirá tu texto y te dará un análisis con tus errores.
              </p>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={10}
                placeholder="Escribe aquí tu texto (mínimo 150 palabras)…"
                className="w-full px-4 py-3 border border-clinic-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinic-red/40"
              />
              <p
                className={`text-xs mt-1 ${
                  palabras < 150 || palabras > 450 ? 'text-clinic-red' : 'text-clinic-green'
                }`}
              >
                {palabras} / 450 palabras
                {palabras < 150 && ` · te faltan ${150 - palabras} para el mínimo`}
                {palabras > 450 && ' · te has pasado del máximo'}
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
                disabled={!escritaValida}
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
