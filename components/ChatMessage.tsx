'use client';
import { Message } from '@/types/chat';
import { Copy, Check, User, Bot } from 'lucide-react';
import { useState } from 'react';

export function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCode = message.content.includes('```') || message.content.includes('<html');

  return (
    <div className={`flex gap-2 md:gap-3 w-full ${isUser? 'flex-row-reverse' : ''}`}>
      <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${isUser? 'bg-white text-black' : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'}`}>
        {isUser? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded- text- md:text- leading-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur
          ${isUser? 'bg-white text-black rounded-br-' : 'bg-[#12121f]/80 border border-white/10 text-gray-100 rounded-bl-'}
        `}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
        <div className="flex items-center gap-2 mt-1.5 px-1">
          <span className="text- text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
          {!isUser && hasCode && (
            <button onClick={copy} className="text- text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-full transition">
              {copied? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied? 'Copied' : 'Copy'}
            </button>
          )}
          {!isUser && message.provider && (
            <span className="text- text-gray-500 bg-white/5 px-2 py-1 rounded-full">⚡ {message.provider} • Velrya AI</span>
          )}
        </div>
      </div>
    </div>
  );
}
