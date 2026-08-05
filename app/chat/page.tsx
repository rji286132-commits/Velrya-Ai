'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { getCurrentUser, logout } from '@/lib/auth-utils';
import type { User, Message } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { messages, loading, addMessage, setMessages, setLoading, setError: setChatError } = useChatStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: Date.now(),
        user_id: user.id,
      };

      addMessage(userMessage);
      setLoading(true);
      setChatError(null);

      try {
        // Call the chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await response.json();

        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: Date.now(),
        };

        addMessage(assistantMessage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred. Please try again.';
        setChatError(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user, addMessage, setLoading, setChatError]
  );

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#08080f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col">
      {/* Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col relative z-10 max-w-4xl mx-auto w-full">
        {/* Error Alert */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Chat Window */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Chat Input */}
        <div className="border-t border-gray-800 px-4 py-4">
          <ChatInput onSend={handleSendMessage} disabled={loading} />
          <p className="text-xs text-gray-500 mt-2 text-center">
            VELRYA AI v1.0 • Powered by Next.js & Supabase
          </p>
        </div>
      </div>
    </div>
  );
}