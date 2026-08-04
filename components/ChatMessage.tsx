'use client';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: any;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message?.role === 'user';

  return (
    <div className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap break-words border ${
        isUser 
          ? 'bg-white text-black border-white' 
          : 'bg-[#12121f] text-white border-white/10'
      }`}>
        {message?.content || ''}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#1c1c2e] text-white border border-white/10 flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
