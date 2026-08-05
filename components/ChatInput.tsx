'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Eye, X } from 'lucide-react';
import FileMenu from './FileMenu';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTogglePreview?: () => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, onTogglePreview, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() &&!disabled) {
      onSend(input);
      setInput('');
      setAttachedFile(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' &&!e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex gap-2 md:gap-3 items-end w-full max-w-4xl mx-auto">
        {/* Plus - Left */}
        <button
          onClick={() => setFileMenuOpen(!fileMenuOpen)}
          disabled={disabled}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 rounded-full shadow-sm transition disabled:opacity-50 text-gray-700"
          title="File menu"
        >
          <Plus size={20} />
        </button>

        {/* BADA Input Box - Center */}
        <div className="flex-1 flex items-end gap-2 bg-white border border-gray-200 rounded-[32px] px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-gray-300 focus-within:border-gray-400 focus-within:ring-0 transition-all">
          {attachedFile && (
            <div className="absolute -top-10 left-12 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
              {attachedFile.name}
              <X size={14} className="cursor-pointer" onClick={() => setAttachedFile(null)} />
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message VELRYA AI..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-gray-900 outline-none resize-none placeholder-gray-400 disabled:opacity-50 text-[15px] leading-6 min-h-[24px] max-h-[140px] py-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAttachedFile(file);
                setInput((prev) => prev + `\n[Attached: ${file.name}]`);
              }
            }}
            className="hidden"
            accept="image/*,.pdf,.txt,.doc,.docx"
          />
        </div>

        {/* Send - Black */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center shadow-sm"
          title="Send message"
        >
          <Send size={18} />
        </button>

        {/* Eye - Right side of Send */}
        <button
          onClick={onTogglePreview}
          className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 hover:bg-gray-50 rounded-full shadow-sm transition text-gray-700 flex items-center justify-center"
          title="Toggle preview"
        >
          <Eye size={20} />
        </button>
      </div>

      <FileMenu isOpen={fileMenuOpen} onClose={() => setFileMenuOpen(false)} />
    </>
  );
}
