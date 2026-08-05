'use client';
import { X, Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { Conversation } from '@/types';

interface Props {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ conversations, currentConversationId, onNewChat, onSelectConversation, onDeleteConversation, isOpen, onClose }: Props) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#171717] text-white z-50 flex flex-col transition-transform duration-300 ${isOpen? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-[56px] px-3 flex items-center justify-between border-b border-white/10">
          <button onClick={onNewChat} className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium">
            <Plus size={16} /> New Chat
          </button>
          <button onClick={onClose} className="ml-2 p-2 hover:bg-white/10 rounded-lg"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <p className="px-3 py-2 text-[10px] tracking-widest text-white/40 uppercase">History</p>
          {conversations.length === 0? (
            <p className="text-center text-white/30 text-sm py-10">No conversations yet</p>
          ) : (
            conversations.map((c) => (
              <div key={c.id} className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 cursor-pointer ${currentConversationId === c.id? 'bg-white/10' : ''}`}>
                <MessageSquare size={14} className="text-white/40 shrink-0" />
                <button onClick={() => onSelectConversation(c.id)} className="flex-1 truncate text-left text-[13px] text-white/90">
                  {c.title || 'New Conversation'}
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-white/10 text-[10px] text-white/30 text-center">VELRYA AI v1.0 • Llama 3.3 70B</div>
      </div>
    </>
  );
}
