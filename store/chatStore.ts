import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  recentChats: string[];
  addRecentChat: (id: string) => void;
  clearRecent: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      recentChats: [],
      addRecentChat: (id) => set((state) => ({
        recentChats: [id, ...state.recentChats.filter(c => c !== id)].slice(0, 10)
      })),
      clearRecent: () => set({ recentChats: [] }),
    }),
    { name: 'chat-storage' }
  )
);