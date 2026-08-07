import { create } from 'zustand';
import type { Message, ChatSession } from '@/types';

interface ChatStore {
  messages: Message[];
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  toastMsg: string | null;
  addMessage: (m: Message) => void;
  setMessages: (m: Message[]) => void;
  setLoading: (b: boolean) => void;
  setError: (e: string | null) => void;
  setToastMsg: (msg: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentSession: null,
  loading: false,
  error: null,
  toastMsg: null,
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setMessages: (m) => set({ messages: m }),
  setLoading: (b) => set({ loading: b }),
  setError: (e) => set({ error: e }),
  setToastMsg: (msg) => set({ toastMsg: msg }),
  clearChat: () => set({ messages: [], currentSession: null, error: null, toastMsg: null }),
}));
