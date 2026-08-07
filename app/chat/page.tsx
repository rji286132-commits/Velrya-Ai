'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { useChatStore } from '@/store/chatStore';
import { getCurrentUser, logout } from '@/lib/auth-utils';
import type { User, Conversation } from '@/types';
import { FREE_MODELS } from '@/lib/modelRegistry';
import { Menu, Loader2, AlertCircle, X, Eye, Code, GitFork, Share2, Globe, Sparkles, ChevronDown } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState('auto');
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

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
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversationId === id) { setMessages([]); setCurrentConversationId(null); router.push('/chat'); }
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return;
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

      let assistantReply = '';

      if (selectedModel.startsWith('puter') && typeof window !== 'undefined' && (window as any).puter?.ai?.chat) {
        try {
          const modelName = selectedModel === 'puter-claude' ? 'claude-3-5-sonnet' : 'gpt-4o';
          const res = await (window as any).puter.ai.chat(content, { model: modelName });
          assistantReply = typeof res === 'string' ? res : res?.message?.content || String(res);
        } catch (pErr) {
          console.warn('Puter client failed, falling back to server API:', pErr);
        }
      }

      if (!assistantReply) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            userId: user.id,
            conversationId: convId,
            modelId: selectedModel
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to generate response');
        }

        const data = await response.json();
        assistantReply = data.response || data.reply || 'No response generated';

        if (data.fallback) {
          showToast('⚡ Used 100% Free Pollinations AI Fallback');
        }
      }

      addMessage({
        id: (Date.now() + 1).toString(),
        content: assistantReply,
        role: 'assistant',
        timestamp: Date.now(),
        user_id: user.id,
        conversation_id: convId!
      });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setChatError(msg);
      setError(msg);
      showToast(`⚠️ ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [user, currentConversationId, selectedModel, addMessage, setLoading, setChatError, router]);

  const handleLogout = async () => { try { await logout(); router.push('/'); } catch {} };

  const handleRemix = () => { showToast('✨ Project remixed!'); };

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Share link copied to clipboard!');
      } else {
        showToast('🔗 Share link generated');
      }
    } catch {
      showToast('🔗 Share link generated');
    }
  };

  const handlePublish = () => { showToast('🚀 Project published successfully!'); };

  if (authLoading) {
    return (
      <div className="h-[100dvh] w-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  if (!user) return null;

  const userInitial = (
    user.email?.charAt(0) ||
    user.display_name?.charAt(0) ||
    user.name?.charAt(0) ||
    'R'
  ).toUpperCase();

  const currentModelLabel = FREE_MODELS.find(m => m.id === selectedModel)?.label || 'Groq Llama 3.3';

  return (
    <div className="h-[100dvh] w-screen bg-white flex flex-col overflow-hidden">
      {/* Sidebar Drawer */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId || undefined}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Top Bar Navigation */}
      <header className="h-[56px] w-full shrink-0 border-b border-black/[0.08] bg-white flex items-center justify-between px-3 md:px-4 sticky top-0 z-20">
        {/* Left Side: Hamburger + Logo + Model Selector + Preview/Code */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition text-zinc-800"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <span className="font-bold text-[15px] tracking-tight text-zinc-900 shrink-0">
            VELRYA AI
          </span>

          {/* Model Selector Dropdown (Hidden) */}
          <div className="hidden relative">
            <button
              onClick={() => setModelMenuOpen(!modelMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-xs font-semibold transition border border-pink-200/80"
              title="Select AI Model"
            >
              <Sparkles size={13} className="text-pink-500 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate">{currentModelLabel}</span>
              <ChevronDown size={13} className="shrink-0" />
            </button>

            {modelMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                  Select AI Provider Model
                </div>
                {FREE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setModelMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-pink-50 transition flex items-center justify-between ${
                      selectedModel === m.id ? 'bg-pink-50 text-pink-700 font-bold' : 'text-zinc-700'
                    }`}
                  >
                    <span className="truncate pr-2">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview / Code Toggle */}
          <div className="hidden sm:flex items-center bg-zinc-100 p-0.5 rounded-lg text-xs font-medium border border-zinc-200/80 ml-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'code'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Code size={13} />
              <span>Code</span>
            </button>
          </div>
        </div>

        {/* Right Side: Remix + Share + Publish + User Avatar */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={handleRemix}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition"
            title="Remix Project"
          >
            <GitFork size={13} className="text-zinc-500" />
            <span>Remix</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-medium transition"
            title="Share Project"
          >
            <Share2 size={13} className="text-zinc-500" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-xs font-medium transition shadow-sm"
            title="Publish Application"
          >
            <Globe size={13} />
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* User Avatar */}
          <div className="relative ml-0.5">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-[13px] hover:opacity-90 transition shadow-sm"
              title={user.email || 'User profile'}
            >
              {userInitial}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-black/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-xs text-zinc-800 font-semibold truncate mt-0.5">
                    {user.email || user.display_name || user.name || 'User'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 text-xs text-red-600 font-medium transition flex items-center gap-2"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-4 z-50 bg-zinc-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Full Width Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white w-full">
        {error && (
          <div className="mx-auto w-[95%] max-w-3xl mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle size={16} />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        <ChatWindow messages={messages} loading={loading} />

        <div className="w-full bg-white pb-4 pt-2">
          <div className="w-[95%] max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={loading} />
            <p className="text-[11px] text-zinc-400 text-center mt-3">
              VELRYA can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[100dvh] w-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
