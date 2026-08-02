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
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('file', file);

      const res = await fetch('/api/chat', { method: 'POST', body: formData });
      const data = await res.json();
      
      set(state => ({
        messages: [...state.messages, 
          { role: 'user', content, timestamp: new Date().toISOString() },
          { role: 'assistant', content: data.response, timestamp: new Date().toISOString(), provider: data.provider }
        ],
        isLoading: false
      }));
      return data.chatId || null;
    } catch { set({ isLoading: false }); return null; }
  },

  loadChat: async (id: string) => {
    const res = await fetch(`/api/chat/${id}`);
    if (res.ok) { const data = await res.json(); set({ messages: data.messages }); }
  },

  loadHistory: async () => {
    const res = await fetch('/api/chat/history');
    if (res.ok) { const data = await res.json(); set({ history: data.history }); }
  },

  deleteChat: async (id: string) => {
    await fetch(`/api/chat/${id}`, { method: 'DELETE' });
    set(state => ({ history: state.history.filter(h => h.id !== id) }));
  },

  clearMessages: () => set({ messages: [] }),
}));