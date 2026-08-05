'use client';

import { memo } from 'react';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none'
            : 'bg-[#1e1e2e] text-gray-100 rounded-bl-none border border-gray-700'
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <span
          className={`text-xs mt-2 block ${
            isUser ? 'text-purple-200' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
});

export default ChatMessage;