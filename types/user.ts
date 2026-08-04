export interface User {
  id: string;
  email: string;
  role: 'user';
  displayName?: string;
  app?: 'VELRYA AI';
  createdAt: string;
}

export interface UserSession {
  user: User;
  expires: string;
  appName: 'VELRYA AI';
}

export const DEFAULT_USER: Partial<User> = {
  role: 'user',
  app: 'VELRYA AI',
};
