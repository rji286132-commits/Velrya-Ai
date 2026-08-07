'use client';

import { useEffect, useState } from 'react';
import { X, Plus, MessageSquare, Trash2, Settings, HelpCircle, Shield, Moon, Monitor } from 'lucide-react';
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

export default function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSettings) setShowSettings(false);
        else if (showHelp) setShowHelp(false);
        else onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, showSettings, showHelp]);

  return (
    <>
      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#12121c] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-[56px] px-3 flex items-center justify-between border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus size={16} /> New Chat
          </button>
          <button
            onClick={onClose}
            className="ml-2 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Close sidebar (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Recent Chats</span>
            <span className="text-[10px] text-zinc-500 font-medium">{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center text-zinc-500 text-xs py-10 px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No chat history yet</p>
              <p className="text-[11px] text-zinc-600 mt-1">Start a new conversation</p>
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = currentConversationId === c.id;
              return (
                <div
                  key={c.id}
                  className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition ${
                    isSelected ? 'bg-white/15 text-white font-medium' : 'text-zinc-300'
                  }`}
                  onClick={() => {
                    onSelectConversation(c.id);
                    onClose();
                  }}
                >
                  <MessageSquare size={15} className={`shrink-0 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                  <span className="flex-1 truncate text-[13px]">{c.title || 'New Conversation'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-zinc-500 transition rounded-md"
                    title="Delete conversation"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions: Settings & Help */}
        <div className="p-2 border-t border-white/10 space-y-1 bg-[#0a0a12] shrink-0">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-medium transition"
          >
            <Settings size={16} className="text-zinc-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-medium transition"
          >
            <HelpCircle size={16} className="text-zinc-400" />
            <span>Help & Support</span>
          </button>
          <div className="pt-2 pb-1 text-[10px] text-zinc-600 text-center font-mono">
            VELRYA AI v1.0 • Gemini 3.5
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#181826] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-0.5 p-2 text-zinc-400 hover:text-white rounded-lg"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Settings size={20} className="text-purple-400" /> Settings
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">AI Model</p>
                  <p className="text-xs text-zinc-400">Gemini 3.5 Flash (Default)</p>
                </div>
                <Monitor size={18} className="text-zinc-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">Theme</p>
                  <p className="text-xs text-zinc-400">System Dark / Light Mode</p>
                </div>
                <Moon size={18} className="text-zinc-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-white">Privacy & Safety</p>
                  <p className="text-xs text-zinc-400">Encrypted sessions</p>
                </div>
                <Shield size={18} className="text-zinc-400" />
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-2.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-zinc-200 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#181826] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-0.5 p-2 text-zinc-400 hover:text-white rounded-lg"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <HelpCircle size={20} className="text-blue-400" /> Help & Support
            </h3>
            <div className="space-y-3 text-xs text-zinc-300">
              <p>Welcome to VELRYA AI! Here are quick tips for building apps & websites:</p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                <li>Type your design prompt or request in the chat.</li>
                <li>Use <strong className="text-white">Preview</strong> and <strong className="text-white">Code</strong> buttons to view generated results.</li>
                <li>Click <strong className="text-white">Remix</strong> or <strong className="text-white">Share</strong> to collaborate.</li>
              </ul>
              <p className="pt-2 text-zinc-400">Need support? Contact support@velrya.ai</p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-2.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-zinc-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
