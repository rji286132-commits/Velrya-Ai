'use client';

import { useEffect, useRef, memo } from 'react';
import type { Message } from '@/types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

const ChatWindow = memo(function ChatWindow({
  messages,
  loading = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && !loading && (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-400">
            Ask me anything! I'm here to help with coding, writing, ideas, and more.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-[#1e1e2e] text-gray-100 px-4 py-3 rounded-lg rounded-bl-none border border-gray-700">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
});

export default ChatWindow;