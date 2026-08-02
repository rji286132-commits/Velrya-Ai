export interface User {
  id: string;
  email: string;
  role: 'user' | 'super_admin';
  displayName?: string;
  createdAt: string;
}

export interface UserSession {
  user: User;
  expires: string;
}