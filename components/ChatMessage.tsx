'use client';

import { memo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
        }`}
      >
        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={`text-xs mt-2 flex items-center justify-between ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>
            {message.created_at
              ? new Date(message.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition ml-2 hover:text-gray-700"
              title="Copy message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;