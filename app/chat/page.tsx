'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatNavbar from '@/components/ChatNavbar';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import FileMenu from '@/components/FileMenu';
import { useChatStore } from '@/store/chatStore';
import { getCurrentUser, logout } from '@/lib/auth-utils';
import type { User, Message, Conversation } from '@/types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

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
        await loadConversations(currentUser.id);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (convId) {
      setCurrentConversationId(convId);
      loadConversationMessages(convId);
    }
  }, [searchParams]);

  const loadConversations = async (userId: string) => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.created_at).getTime(),
          user_id: msg.user_id,
          conversation_id: msg.conversation_id,
          created_at: msg.created_at,
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(data.conversation.id);
        setMessages([]);
        setError(null);
        router.push(`/chat?conversation=${data.conversation.id}`);
        await loadConversations(user!.id);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      setConversations(conversations.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      let convId = currentConversationId;
      if (!convId) {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: content.substring(0, 50) }),
        });
        if (response.ok) {
          const data = await response.json();
          convId = data.conversation.id;
          setCurrentConversationId(convId);
          router.push(`/chat?conversation=${convId}`);
          await loadConversations(user.id);
        }
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: Date.now(),
        user_id: user.id,
        conversation_id: convId,
      };

      addMessage(userMessage);
      setLoading(true);
      setChatError(null);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            userId: user.id,
            conversationId: convId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get response');
        }

        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: Date.now(),
          conversation_id: convId,
        };

        addMessage(assistantMessage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
        setChatError(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user, currentConversationId, addMessage, setLoading, setChatError, router]
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
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <ChatNavbar user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden">
        <div className={`fixed md:relative w-64 h-full bg-gray-50 border-r border-gray-200 z-30 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId || undefined}
            onNewChat={handleNewChat}
            onSelectConversation={(id) => {
              setCurrentConversationId(id);
              router.push(`/chat?conversation=${id}`);
              setSidebarOpen(false);
            }}
            onDeleteConversation={handleDeleteConversation}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col w-full">
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          <ChatWindow messages={messages} loading={loading} />

          <div className="border-t border-gray-200 px-4 py-4 bg-white">
            <ChatInput
              onSend={handleSendMessage}
              onMenuClick={() => setFileMenuOpen(!fileMenuOpen)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              VELRYA AI v1.0 • Powered by Next.js & Supabase • Llama 3.3 70B
            </p>
          </div>
        </div>
      </div>

      <FileMenu isOpen={fileMenuOpen} onClose={() => setFileMenuOpen(false)} />
    </div>
  );
}