'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Eye, Image as ImageIcon, FileText, X, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onTogglePreview?: () => void;
}

export default function ChatInput({ onSend, disabled, onTogglePreview }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; size: string }[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close upload menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    };
    if (showUploadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadMenu]);

  const send = () => {
    if ((!input.trim() && attachedFiles.length === 0) || disabled) return;

    let fullMessage = input.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => `[Attached ${f.type}: ${f.name}]`).join(' ');
      fullMessage = fullMessage ? `${fullMessage}\n\n${fileNames}` : fileNames;
    }

    onSend(fullMessage);
    setInput('');
    setAttachedFiles([]);
    setShowUploadMenu(false);
    if (textareaRef.current) textareaRef.current.style.height = '52px';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttached = Array.from(files).map((f) => ({
      name: f.name,
      type: isImage ? 'Image' : 'File',
      size: (f.size / 1024).toFixed(1) + ' KB',
    }));

    setAttachedFiles((prev) => [...prev, ...newAttached]);
    setShowUploadMenu(false);
    if (e.target) e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-full bg-white border border-zinc-200/90 rounded-[26px] shadow-sm flex flex-col z-20 pointer-events-auto">
      {/* Attached files preview bar */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 border-b border-zinc-100">
          {attachedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded-lg border border-zinc-200"
            >
              {file.type === 'Image' ? (
                <ImageIcon size={13} className="text-purple-600" />
              ) : (
                <Paperclip size={13} className="text-blue-600" />
              )}
              <span className="font-medium max-w-[140px] truncate">{file.name}</span>
              <span className="text-[10px] text-zinc-500">({file.size})</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="ml-1 text-zinc-400 hover:text-zinc-700 p-0.5 rounded transition"
                title="Remove attachment"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Textarea Input - Visible black/gray text */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Message VELRYA..."
        rows={1}
        disabled={disabled}
        className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 caret-zinc-900 px-5 pt-4 pb-2 outline-none resize-none text-[15px] font-normal min-h-[52px] max-h-[160px] z-10 pointer-events-auto rounded-[26px]"
      />

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between px-3 pb-3 relative">
        <div className="flex items-center gap-2 relative" ref={menuRef}>
          {/* Plus (+) Button for Upload Menu */}
          <button
            type="button"
            onClick={() => setShowUploadMenu((prev) => !prev)}
            className={`w-8 h-8 rounded-full transition grid place-items-center ${
              showUploadMenu ? 'bg-zinc-200 text-zinc-900' : 'hover:bg-zinc-100 text-zinc-600'
            }`}
            title="Upload image or file"
          >
            <Plus size={18} />
          </button>

          {/* Upload Popover Menu */}
          {showUploadMenu && (
            <div className="absolute bottom-11 left-0 bg-white border border-zinc-200 rounded-2xl shadow-xl p-1.5 z-50 flex flex-col gap-1 min-w-[160px] pointer-events-auto animate-in fade-in duration-150">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition text-left"
              >
                <ImageIcon size={15} className="text-zinc-500" />
                <span>Upload image</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition text-left"
              >
                <FileText size={15} className="text-zinc-500" />
                <span>Upload file</span>
              </button>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={(e) => handleFileChange(e, true)}
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, false)}
            className="hidden"
          />

          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-600 transition"
              title="Toggle Preview"
            >
              <Eye size={18} />
            </button>
          )}
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={send}
          disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
          className="w-8 h-8 bg-black text-white rounded-full grid place-items-center disabled:opacity-30 hover:bg-zinc-800 transition shadow-sm"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
