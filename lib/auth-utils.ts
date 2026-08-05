import { supabase } from './supabase/client';
import type { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error ||!user) return null;

    const currentUser: User = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      created_at: user.created_at,
    };
    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut();
    if (typeof window!== 'undefined') {
      localStorage.removeItem('velrya_user');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

export function getInitialLetter(nameOrEmail: string): string {
  if (!nameOrEmail) return 'U';
  return nameOrEmail.trim().charAt(0).toUpperCase();
}
