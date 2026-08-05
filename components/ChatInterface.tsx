'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: msg }]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: `Velrya: "${msg}" samajh gaya!` }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#0a0a0f] text-white">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && <p className="text-gray-500 text-center mt-20">Start chatting with VELRYA AI...</p>}
          {messages.map((m) => (
            <div key={m.id} className={`p-3 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-white text-black ml-auto' : 'bg-[#1c1c2e] border border-white/10'}`}>
              {m.content}
            </div>
          ))}
          {isLoading && <p className="text-gray-400 text-sm">Thinking...</p>}
        </div>
        <div className="p-3 border-t border-white/10">
          <ChatInput onSend={handleSend} disabled={isLoading} onTogglePreview={() => setShowPreview(!showPreview)} />
        </div>
      {showPreview && (
        <div className="hidden md:flex w-[50%] bg-white text-black items-center justify-center border-l">
          Preview Panel - Eye se band hoga
        </div>
      )}
    </div>
  );
}
