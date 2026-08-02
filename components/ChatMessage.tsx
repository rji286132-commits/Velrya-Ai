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
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-blue-600' : 'bg-purple-600'}`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-lg ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-100 rounded-bl-none'}`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
          {!isUser && hasCode && (
            <button onClick={copy} className="text-xs text-gray-400 hover:text-white">
              {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />} {copied ? 'Copied' : 'Copy'}
            </button>
          )}
          {!isUser && message.provider && (
            <span className="text-xs text-gray-500">⚡ {message.provider}</span>
          )}
        </div>
      </div>
    </div>
  );
}