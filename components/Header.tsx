'use client';
import { Menu, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-white hover:bg-gray-800 p-2 rounded">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-xl font-bold text-white">🔥 Virya AI</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300 hidden sm:block">{user?.email}</span>
        {isAdmin && (
          <Link href="/dashboard">
            <button className="text-blue-400 hover:text-blue-300 p-2 rounded">
              <LayoutDashboard className="h-5 w-5" />
            </button>
          </Link>
        )}
        <button onClick={logout} className="text-gray-400 hover:text-white p-2 rounded">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}