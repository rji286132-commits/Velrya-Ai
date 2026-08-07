'use client';
import { X, Image as ImageIcon, FileText, Code } from 'lucide-react';
export default function FileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl border border-black/10" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-sm">Add attachment</h3><button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full"><X size={18}/></button></div>
        <div className="grid grid-cols-3 gap-2"><button className="p-4 border rounded-xl hover:bg-zinc-50 flex flex-col items-center gap-2 text-xs"><ImageIcon size={20}/>Image</button><button className="p-4 border rounded-xl hover:bg-zinc-50 flex flex-col items-center gap-2 text-xs"><FileText size={20}/>Document</button><button className="p-4 border rounded-xl hover:bg-zinc-50 flex flex-col items-center gap-2 text-xs"><Code size={20}/>Code</button></div>
        <p className="text-[11px] text-zinc-400 text-center mt-3">File upload coming soon</p>
      </div>
    </div>
  );
}
