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
    if (!content.trim() && !file) return;
    onSend(content, file || undefined);
    setContent('');
    setFile(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="space-y-2">
      {file && (
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
          <span className="text-white text-sm">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 bg-gray-800 rounded-lg border border-gray-700 p-2">
        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white">
          <Paperclip className="h-5 w-5" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} onKeyDown={handleKeyDown} placeholder="Describe your website..." className="flex-1 bg-transparent text-white outline-none resize-none min-h-[40px] max-h-[120px] py-1" rows={1} disabled={isLoading} />
        <button onClick={handleSend} disabled={(!content.trim() && !file) || isLoading} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}