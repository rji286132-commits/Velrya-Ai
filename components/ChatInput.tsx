'use client';
import { useState, useRef } from 'react';
import { Send, Plus } from 'lucide-react';
import FileMenu from './FileMenu';

export default function ChatInput({ onSend, disabled }: { onSend: (t: string) => void; disabled?: boolean }) {
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (ref.current) ref.current.style.height = '52px';
  };

  return (
    <div className="w-full bg-white border border-black/10 rounded-[26px] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] focus-within:border-black/15 focus-within:shadow-[0_0_0_1px_rgba(0,0,0,0.08)] flex flex-col transition-all">
      <textarea
        ref={ref}
        value={input}
        onChange={(e) => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,160)+'px'; }}
        onKeyDown={(e) => { if(e.key==='Enter' &&!e.shiftKey){ e.preventDefault(); send(); }}}
        placeholder="Message VELRYA..."
        rows={1}
        disabled={disabled}
        className="w-full bg-transparent px-5 pt-4 pb-2 outline-none resize-none text-[15px] placeholder-zinc-400 min-h-[52px] max-h-[160px]"
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <button onClick={() => setMenuOpen(true)} className="w-8 h-8 rounded-full hover:bg-zinc-100 grid place-items-center text-zinc-600"><Plus size={18} /></button>
        <button onClick={send} disabled={!input.trim() || disabled} className="w-8 h-8 bg-black text-white rounded-full grid place-items-center disabled:opacity-30 hover:bg-zinc-800 transition"><Send size={14} /></button>
      </div>
      <FileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
