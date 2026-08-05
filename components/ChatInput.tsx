'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Eye } from 'lucide-react';
import FileMenu from './FileMenu';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setAttachedFile(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setInput(input + `\n[Attached: ${file.name}]`);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center w-full">
        {/* Plus Menu */}
        <button
          onClick={() => setFileMenuOpen(!fileMenuOpen)}
          disabled={disabled}
          className="flex-shrink-0 p-2.5 hover:bg-gray-100 rounded-full transition disabled:opacity-50 text-gray-600 hover:text-gray-900"
          title="File menu"
        >
          <Plus size={20} />
        </button>

        {/* Input Container */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-[28px] px-4 py-2 shadow-lg hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message VELRYA AI..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-gray-900 outline-none resize-none placeholder-gray-400 disabled:opacity-50 text-sm md:text-base"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.txt,.doc,.docx"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          title="Send message"
        >
          <Send size={18} />
        </button>

        {/* Eye Button */}
        <button
          className="flex-shrink-0 p-2.5 hover:bg-gray-100 rounded-full transition text-gray-600 hover:text-gray-900"
          title="Toggle sidebar"
        >
          <Eye size={20} />
        </button>
      </div>

      {/* File Menu Modal */}
      <FileMenu isOpen={fileMenuOpen} onClose={() => setFileMenuOpen(false)} />
    </>
  );
}