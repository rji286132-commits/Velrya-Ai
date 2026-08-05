'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onMenuClick?: () => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onMenuClick, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ).toString() + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <button
        onClick={onMenuClick}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 text-gray-600"
        title="File menu"
      >
        <Plus size={20} />
      </button>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Message VELRYA AI..."
        disabled={disabled}
        rows={1}
        className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none resize-none placeholder-gray-400 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="px-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
      >
        <Send size={20} />
      </button>
    </div>
  );
}