import { create } from 'zustand';
import type { Message, ChatSession } from '@/types';

interface ChatStore {
  messages: Message[];
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  currentSession: null,
  loading: false,
  error: null,

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages: Message[]) =>
    set({ messages }),

  setLoading: (loading: boolean) =>
    set({ loading }),

  setError: (error: string | null) =>
    set({ error }),

  setCurrentSession: (session: ChatSession | null) =>
    set({ currentSession: session }),

  clearChat: () =>
    set({
      messages: [],
      currentSession: null,
      error: null,
    }),
}));