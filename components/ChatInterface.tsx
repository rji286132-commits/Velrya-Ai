'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import Preview from './Preview';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleSend = async (msg: string, file?: File) => {
    if (!msg.trim() && !file) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: file ? `${msg}\n[File: ${file.name}]` : msg,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Yahan tera AI call ayega
    try {
      // Simulate AI response for now
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Samajh gaya! "${msg}" ke liye website bana raha hu...`,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#0a0a0f] overflow-hidden">
      {/* Left - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
        
        {/* Bottom Input - Yahan Eye button connect ho gaya */}
        <div className="p-3 md:p-4 border-t border-white/5 bg-[#0a0a0f]">
          <ChatInput 
            onSend={handleSend} 
            disabled={isLoading} 
            onTogglePreview={() => setShowPreview(!showPreview)} 
          />
        </div>
      </div>

      {/* Right - Preview - Eye se khulega/band hoga */}
      {showPreview && (
        <div className="w-full md:w-[50%] border-l border-white/10 bg-white hidden md:flex flex-col">
          <Preview />
        </div>
      )}
    </div>
  );
}
