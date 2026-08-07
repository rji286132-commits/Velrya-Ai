import { create } from 'zustand';
import { Message, ChatHistoryItem } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  history: ChatHistoryItem[];
  isLoading: boolean;
  sendMessage: (content: string, file?: File) => Promise<string | null>;
  loadChat: (id: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChat = create<ChatStore>((set, get) => ({
  messages: [],
  history: [],
  isLoading: false,

  sendMessage: async (content: string, file?: File) => {
    const userMsg: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    set({ isLoading: true, messages: [...get().messages, userMsg] });

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('file', file);

      const res = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'VELRYA AI error');

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        provider: data.provider || 'VELRYA AI',
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isLoading: false,
      }));

      // Refresh history after new chat
      get().loadHistory();

      return data.chatId || null;
    } catch (err) {
      set({ isLoading: false });
      console.error('VELRYA AI Chat Error:', err);
      return null;
    }
  },

  loadChat: async (id: string) => {
    try {
      const res = await fetch(`/api/chat/${id}`);
      if (res.ok) {
        const data = await res.json();
        set({ messages: data.messages || [] });
      }
    } catch (e) {
      console.error('VELRYA AI loadChat error', e);
    }
  },

  loadHistory: async () => {
    try {
      const res = await fetch('/api/chat/history');
      if (res.ok) {
        const data = await res.json();
        set({ history: data.history || [] });
      }
    } catch (e) {
      console.error('VELRYA AI loadHistory error', e);
    }
  },

  deleteChat: async (id: string) => {
    try {
      await fetch(`/api/chat/${id}`, { method: 'DELETE' });
      set((state) => ({
        history: state.history.filter((h) => h.id !== id),
      }));
    } catch (e) {
      console.error('VELRYA AI delete error', e);
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
