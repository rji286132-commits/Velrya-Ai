export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  user_id: string;
  conversation_id: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: number;
  updated_at: number;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}
