'use client';
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from '@/types';

export default function ChatWindow({ messages, loading }: { messages: Message[]; loading?: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {messages.length === 0 &&!loading && (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center text-xl mb-4">✦</div>
          <h2 className="text-xl font-semibold mb-1">How can I help you today?</h2>
          <p className="text-sm text-zinc-500">Build websites, write code, create anything with VELRYA</p>
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto">
        {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
        {loading && <div className="px-6 py-6 text-sm text-zinc-500 animate-pulse">VELRYA is thinking...</div>}
        <div ref={endRef} />
      </div>
    </div>
  );
}
