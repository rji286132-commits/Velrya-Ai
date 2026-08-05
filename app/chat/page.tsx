'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { useChatStore } from '@/store/chatStore';
import { getCurrentUser, logout } from '@/lib/auth-utils';
import type { User, Message, Conversation } from '@/types';
import { Loader2, AlertCircle, Menu, LogOut, Settings } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

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
          role: msg.role as 'user' | 'assistant',
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

  const createNewConversation = async (title: string): Promise<string> => {
    const response = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    const data = await response.json();
    return data.conversation.id as string;
  };

  const handleNewChat = async () => {
    try {
      if (!user) return;
      const convId = await createNewConversation('New Conversation');
      setCurrentConversationId(convId);
      setMessages([]);
      setError(null);
      router.push(`/chat?conversation=${convId}`);
      await loadConversations(user.id);
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create new conversation');
    }
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      try {
        let convId = currentConversationId;

        // Create conversation if needed
        if (!convId) {
          convId = await createNewConversation(content.substring(0, 50));
          setCurrentConversationId(convId);
          router.push(`/chat?conversation=${convId}`);
          await loadConversations(user.id);
        }

        // Add user message
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

        // Call AI API
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
          user_id: user.id,
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
    [user, currentConversationId, addMessage, setLoading, setChatError, router, conversations]
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
      <div className="h-[100dvh] w-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-[100dvh] w-screen bg-white flex flex-col relative">
      {/* Header */}
      <header className="w-full h-16 shrink-0 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white">
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700">
          <Menu size={20} />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            ✨ VELRYA
          </h1>
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition text-sm"
          >
            {user.email?.[0].toUpperCase() || 'U'}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 truncate">
                {user.email}
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error Alert */}
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

        {/* Chat Messages */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Input Area */}
        <div className="w-full p-4 bg-white border-t border-gray-200">
          <div className="w-[95%] max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              VELRYA AI v1.0 • Llama 3.3 70B • Powered by Next.js & Supabase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}