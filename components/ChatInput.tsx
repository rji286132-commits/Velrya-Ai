'use client';
import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string, file?: File) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!content.trim() &&!file) return;
    onSend(content, file || undefined);
    setContent('');
    setFile(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {file && (
        <div className="flex items-center gap-2 bg-[#1c1c2e]/80 backdrop-blur px-3 py-2 rounded-xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <span className="text-white text-sm truncate flex-1">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400 p-1 hover:bg-white/10 rounded-full transition">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 bg-[#12121f]/80 backdrop-blur-xl rounded- border border-white/10 p-2 md:p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] focus-within:border-white/20 transition-all">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 md:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your website with VELRYA AI..."
          className="flex-1 bg-transparent text-white outline-none resize-none min-h- max-h- py-3 text- placeholder:text-gray-500 leading-6"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={(!content.trim() &&!file) || isLoading}
          className="p-2.5 md:p-3 bg-white hover:bg-gray-200 rounded-full text-black disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(255,255,255,0.2)] active:scale-[0.95] transition-all shrink-0"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <p className="text- text-gray-500 text-center px-4 hidden md:block">Press Enter to send, Shift + Enter for new line</p>
    </div>
  );
}
