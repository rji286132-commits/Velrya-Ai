export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  files?: string[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: string;
  preview?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}