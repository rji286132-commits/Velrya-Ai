import { supabase } from './supabase/client';
import type { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      const stored = localStorage.getItem('velrya_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    }

    const currentUser: User = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name,
      created_at: user.created_at,
    };

    localStorage.setItem('velrya_user', JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('velrya_user');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}