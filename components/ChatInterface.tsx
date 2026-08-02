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
    if (newId && !chatId) onChatCreated(newId);
    setTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-white font-semibold">{chatId ? 'Chat' : 'New Chat'}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white">Welcome to Virya AI</h3>
            <p className="text-gray-400">Describe your website, I'll build it.</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['Build a portfolio', 'Create ecommerce', 'Design landing page', 'Make blog'].map((s) => (
                <button key={s} onClick={() => handleSend(s)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 border border-gray-700">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
        {typing && <div className="text-gray-400 animate-pulse">AI is thinking...</div>}
        <div ref={endRef} />
      </div>
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}