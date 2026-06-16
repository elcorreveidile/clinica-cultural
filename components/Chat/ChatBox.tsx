'use client';

import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { ChatMessage } from '@/lib/types';
import ChatMarkdown from '@/components/Chat/ChatMarkdown';

export default function ChatBox({ level }: { level: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '¡Hola! Soy La Doctora de la Clínica. Cuéntame tu urgencia lingüística: una duda de gramática, una palabra, una frase que no entiendes… Estoy aquí para ayudarte. 🩺',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/emergencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m.role !== 'assistant' || m.content) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...next, { role: 'assistant', content: data.response }]);
    } catch {
      toast.error('No pudimos contactar con La Doctora. Inténtalo de nuevo.');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-clinic-gray rounded-2xl flex flex-col h-[70vh]">
      <div className="px-5 py-3 border-b border-clinic-gray flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-clinic-green animate-pulse" />
        <span className="font-semibold text-clinic-blue">La Doctora</span>
        <span className="ml-auto text-xs text-clinic-blue/50">Tu nivel: {level}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-clinic-red text-white rounded-br-sm whitespace-pre-wrap'
                  : 'bg-clinic-gray/50 text-clinic-blue rounded-bl-sm'
              }`}
            >
              {m.role === 'assistant' ? (
                <ChatMarkdown content={m.content} />
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-clinic-gray/50 text-clinic-blue/60 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
              La Doctora está escribiendo…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="p-4 border-t border-clinic-gray flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu urgencia lingüística…"
          className="flex-1 px-4 py-2.5 border border-clinic-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinic-red/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-clinic-red text-white font-semibold rounded-xl hover:bg-clinic-red/90 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
