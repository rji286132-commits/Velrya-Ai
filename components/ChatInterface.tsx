'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';
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
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Samajh gaya! "${msg}" ke liye code bana raha hu...`,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#0a0a0f] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        <div className="p-3 md:p-4 border-t border-white/5 bg-[#0a0a0f]">
          <ChatInput 
            onSend={handleSend} 
            disabled={isLoading} 
            onTogglePreview={() => setShowPreview(!showPreview)} 
          />
        </div>
      </div>
      {showPreview && (
        <div className="w-full md:w-[50%] border-l border-white/10 bg-white hidden md:flex items-center justify-center text-black">
          Preview yahan ayega
        </div>
      )}
    </div>
  );
}
