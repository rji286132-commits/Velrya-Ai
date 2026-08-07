'use client';

import Link from 'next/link';
import { LogOut, Menu, Settings, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types';
import { FREE_MODELS } from '@/lib/modelRegistry';

interface ChatNavbarProps {
  user: User | null;
  onLogout: () => void;
  onMenuClick?: () => void;
  loading?: boolean;
  selectedModel?: string;
  onSelectModel?: (id: string) => void;
}

export default function ChatNavbar({
  user,
  onLogout,
  onMenuClick,
  loading = false,
  selectedModel = 'groq-llama',
  onSelectModel,
}: ChatNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  const activeModel = FREE_MODELS.find((m) => m.id === selectedModel) || FREE_MODELS[0];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            ✨ VELRYA
          </Link>

          {/* Model Selector Dropdown (Hidden) */}
          <div className="hidden relative ml-2">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-semibold transition border border-pink-200"
            >
              <Sparkles size={14} className="text-pink-500" />
              <span className="max-w-[130px] sm:max-w-none truncate">{activeModel.label}</span>
              <ChevronDown size={14} />
            </button>

            {modelOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  Select AI Model
                </div>
                {FREE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel?.(m.id);
                      setModelOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-pink-50 transition flex items-center justify-between ${
                      selectedModel === m.id ? 'bg-pink-50 text-pink-700 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          {user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 max-w-[150px] truncate">
                  {user.email}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {user.email}
                  </div>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    disabled={loading}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {user && (
            <button
              onClick={onLogout}
              disabled={loading}
              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
