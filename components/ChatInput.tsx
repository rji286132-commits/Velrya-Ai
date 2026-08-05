'use client';

import { useState, useRef } from 'react';
import { Send, Plus, Eye } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onTogglePreview?: () => void;
}

export default function ChatInput({ onSend, disabled, onTogglePreview }: ChatInputProps) {
  const [input, setInput] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (ref.current) ref.current.style.height = '52px';
  };

  return (
    <div className="w-full bg-white border border-black/10 rounded-[26px] shadow-sm flex flex-col">
      <textarea
        ref={ref}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' &&!e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Message VELRYA..."
        rows={1}
        disabled={disabled}
        className="w-full bg-transparent px-5 pt-4 pb-2 outline-none resize-none text-[15px] min-h-[52px] max-h-[160px]"
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex gap-2">
          <button type="button" className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-500">
            <Plus size={18} />
          </button>
          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-500"
              title="Toggle Preview"
            >
              <Eye size={18} />
            </button>
          )}
        </div>
        <button
          onClick={send}
          disabled={!input.trim() || disabled}
          className="w-8 h-8 bg-black text-white rounded-full grid place-items-center disabled:opacity-30"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
