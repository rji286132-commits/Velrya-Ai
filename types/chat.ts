export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  files?: string[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  preview?: string;
  providerUsed?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type AppUser = {
  id: string;
  email: string;
  role: 'user';
};
