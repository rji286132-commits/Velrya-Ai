'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, Trash2, Clock } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

interface SidebarProps {
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({ onSelectChat, onNewChat }: SidebarProps) {
  const { history, loadHistory, deleteChat } = useChat();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = history.filter(h => h.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <button onClick={onNewChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> New Chat
        </button>
      </div>
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-white" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((item) => (
          <div key={item.id} onClick={() => onSelectChat(item.id)} className="mx-2 mb-1 p-2 rounded hover:bg-gray-800 cursor-pointer flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-white truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <Clock className="h-3 w-3" /> {new Date(item.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); deleteChat(item.id); }} className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}