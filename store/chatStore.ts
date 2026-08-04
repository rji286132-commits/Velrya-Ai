import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  recentChats: string[];
  activeChatId: string | null;
  addRecentChat: (id: string) => void;
  setActiveChat: (id: string | null) => void;
  clearRecent: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      recentChats: [],
      activeChatId: null,
      addRecentChat: (id) =>
        set((state) => ({
          recentChats: [id, ...state.recentChats.filter((c) => c !== id)].slice(0, 20),
        })),
      setActiveChat: (id) => set({ activeChatId: id }),
      clearRecent: () => set({ recentChats: [], activeChatId: null }),
    }),
    { 
      name: 'velrya-chat-storage',
      version: 1,
    }
  )
);
