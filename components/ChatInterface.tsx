'use client';
import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated: (id: string) => void;
}

export function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage, loadChat, clearMessages } = useChat();
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) loadChat(chatId);
    else clearMessages();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string, file?: File) => {
    setTyping(true);
    const newId = await sendMessage(content, file);
    if (newId &&!chatId) onChatCreated(newId);
    setTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h- w-full bg-[#08080f] relative overflow-hidden">
      {/* 3D Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-purple-600/10 rounded-full blur- pointer-events-none" />

      <div className="border-b border-white/10 p-4 bg-[#0f0f18]/80 backdrop-blur-xl sticky top-0 z-10">
        <h2 className="text-white font-semibold max-w-6xl mx-auto">{chatId? 'Chat with Velrya AI' : 'New Chat - Velrya AI'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 w-full max-w-6xl mx-auto scrollbar-thin">
        {messages.length === 0? (
          <div className="flex flex-col items-center justify-center min-h- text-center px-4">
            <div className="w-20 h-20 rounded- bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-3xl mb-6 shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              🚀
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">Welcome to Velrya AI</h3>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-md">Describe your website, I&apos;ll build it in seconds with 3D premium design.</p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
              {['Build a portfolio', 'Create ecommerce', 'Design landing page', 'Make blog'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-4 py-2.5 bg-[#12121f]/80 backdrop-blur border border-white/10 hover:bg-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
        {typing && (
          <div className="flex gap-2 items-center text-gray-400 text-sm animate-pulse px-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            Velrya AI is thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/10 p-3 md:p-4 bg-[#0f0f18]/80 backdrop-blur-xl sticky bottom-0">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
