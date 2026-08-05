'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Trash2, Plus } from 'lucide-react';
import type { Conversation } from '@/types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen = true,
  onClose,
}: SidebarProps) {
  return (
    <div
      className={`h-full w-64 bg-gray-50 border-r border-gray-200 flex flex-col ${
        isOpen ? 'block' : 'hidden'
      } md:block`}
    >
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id}>
              <button
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  currentConversationId === conv.id
                    ? 'bg-gray-200 font-semibold'
                    : 'hover:bg-gray-100'
                }}`}
              >
                <div className="truncate text-sm flex items-center justify-between group">
                  <span className="truncate">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(conv.created_at).toLocaleDateString()}
                </div>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>VELRYA AI v1.0</p>
      </div>
    </div>
  );
}