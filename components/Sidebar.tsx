'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, Trash2, Clock } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface SidebarProps {
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({ onSelectChat, onNewChat }: SidebarProps) {
  const chatData: any = useChat();
  const history = chatData?.history || [];
  const loadHistory = chatData?.loadHistory || (() => {});
  const deleteChat = chatData?.deleteChat || (() => {});
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = history.filter((h: any) => h?.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full min-h-screen w-full md:w-80 bg-[#08080f]/90 backdrop-blur-xl border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <span className="font-black text-white">VELRYA AI</span>
        </div>
        <button
          onClick={onNewChat}
          className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-full flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" /> New Chat
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121f] border border-white/10 rounded-full py-2.5 pl-9 pr-3 text-white text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-500 text-center mt-10 px-4">No chats found in Velrya AI</p>
        ) : (
          filtered.map((item: any) => (
            <div
              key={item.id}
              onClick={() => onSelectChat(item.id)}
              className="group p-3 rounded-xl hover:bg-white/5 cursor-pointer flex items-center justify-between border border-transparent hover:border-white/10"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-sm text-white truncate font-medium">{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 pl-5">
                  <Clock className="h-3 w-3" /> {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ''}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">© VELRYA AI</p>
      </div>
    </div>
  );
}
