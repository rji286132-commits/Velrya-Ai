'use client';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 md:h-20 w-full bg-[#0f0f18]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-white hover:bg-white/10 p-2 md:p-2.5 rounded-full transition">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg md:text-xl font-black tracking-tight text-white">VELRYA AI</span>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300 max-w- truncate">{user?.email}</span>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 md:p-2.5 rounded-full transition">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
