'use client';

import { useState, useRef } from 'react';
import { Send, Plus } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  return (
    <div className="w-full bg-white border border-black/10 rounded-[26px] shadow-sm flex flex-col focus-within:border-black/20 transition-all">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message VELRYA..."
        rows={1}
        disabled={disabled}
        className="w-full bg-transparent px-5 pt-4 pb-2 outline-none resize-none text-[15px] placeholder:text-zinc-400 min-h-[52px] max-h-[160px]"
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <button
          type="button"
          className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500"
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-zinc-800 transition"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
