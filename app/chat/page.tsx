'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { useChatStore } from '@/store/chatStore';
import { getCurrentUser, logout } from '@/lib/auth-utils';
import type { User, Message, Conversation } from '@/types';
import { Menu, Loader2, AlertCircle, X } from 'lucide-react';

// Inner component with useSearchParams
function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { messages, loading, addMessage, setMessages, setLoading, setError: setChatError } = useChatStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) { router.push('/login'); return; }
        setUser(currentUser);
        await loadConversations();
      } catch { router.push('/login'); }
      finally { setAuthLoading(false); }
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

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) { const data = await res.json(); setConversations(data.conversations || []); }
    } catch {}
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.messages.map((msg: any) => ({
          id: msg.id, content: msg.content, role: msg.role,
          timestamp: new Date(msg.created_at).getTime(),
          user_id: msg.user_id, conversation_id: msg.conversation_id, created_at: msg.created_at,
        }));
        setMessages(formatted);
      }
    } catch {}
  };

  const createNewConversation = async (title: string) => {
    const res = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data.conversation.id as string;
  };

  const handleNewChat = async () => {
    try {
      const convId = await createNewConversation('New Conversation');
      setCurrentConversationId(convId);
      setMessages([]); setError(null);
      router.push(`/chat?conversation=${convId}`);
      await loadConversations();
      setSidebarOpen(false);
    } catch { setError('Failed to create new chat'); }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    router.push(`/chat?conversation=${id}`);
    loadConversationMessages(id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      setConversations(prev => prev.filter(c => c.id!== id));
      if (currentConversationId === id) { setMessages([]); setCurrentConversationId(null); router.push('/chat'); }
    } catch {}
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!user ||!content.trim()) return;
    try {
      let convId = currentConversationId;
      if (!convId) {
        convId = await createNewConversation(content.substring(0, 50));
        setCurrentConversationId(convId);
        router.push(`/chat?conversation=${convId}`);
        await loadConversations();
      }
      addMessage({ id: Date.now().toString(), content, role: 'user', timestamp: Date.now(), user_id: user.id, conversation_id: convId! });
      setLoading(true);
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, userId: user.id, conversationId: convId }) });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Failed'); }
      const data = await response.json();
      addMessage({ id: (Date.now()+1).toString(), content: data.response, role: 'assistant', timestamp: Date.now(), user_id: user.id, conversation_id: convId! });
    } catch (err) {
      const msg = err instanceof Error? err.message : 'Something went wrong';
      setChatError(msg); setError(msg);
    } finally { setLoading(false); }
  }, [user, currentConversationId, addMessage, setLoading, setChatError, router]);

  const handleLogout = async () => { try { await logout(); router.push('/'); } catch {} };

  if (authLoading) {
    return <div className="h-[100dvh] w-screen bg-white flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;
  }

  if (!user) return null;

  return (
    <div className="h-[100dvh] w-screen bg-white flex flex-col overflow-hidden">
      <Sidebar conversations={conversations} currentConversationId={currentConversationId || undefined} onNewChat={handleNewChat} onSelectConversation={handleSelectConversation} onDeleteConversation={handleDeleteConversation} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="h-[56px] w-full shrink-0 border-b border-black/[0.08] bg-white flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-zinc-100 rounded-lg transition"><Menu size={22} className="text-zinc-800" /></button>
          <span className="font-bold text-[15px] tracking-tight">VELRYA AI</span>
        </div>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-[13px]">{user.email?.[0].toUpperCase()}</button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-black/10 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 text-sm text-zinc-500 truncate border-b">{user.email}</div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 text-sm">Log out</button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {error && <div className="mx-auto w-[95%] max-w-3xl mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"><AlertCircle size={16} /><span className="flex-1">{error}</span><button onClick={() => setError(null)}><X size={16} /></button></div>}
        <ChatWindow messages={messages} loading={loading} />
        <div className="w-full bg-white pb-4 pt-2">
          <div className="w-[95%] max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={loading} />
            <p className="text-[11px] text-zinc-400 text-center mt-3">VELRYA can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// MAIN EXPORT WITH SUSPENSE - FIX FOR VERCEL DEPLOY
export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] w-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
      <ChatPageContent />
    </Suspense>
  );
}
