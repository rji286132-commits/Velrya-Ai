import { supabase } from './supabase/client';
import type { User } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      const displayName = user.user_metadata?.display_name || user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const currentUser: User = {
        id: user.id,
        email: user.email || '',
        name: displayName,
        display_name: displayName,
        displayName: displayName,
        user_metadata: user.user_metadata || { display_name: displayName },
        created_at: user.created_at,
      };
      return currentUser;
    }

    if (typeof window !== 'undefined') {
      const localStr = localStorage.getItem('velrya_user') || localStorage.getItem('user');
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (parsed && (parsed.id || parsed.email)) {
            const displayName = parsed.display_name || parsed.displayName || parsed.name || parsed.email?.split('@')[0] || 'User';
            return {
              id: parsed.id || 'demo-user-1',
              email: parsed.email || 'user@example.com',
              name: displayName,
              display_name: displayName,
              displayName: displayName,
              user_metadata: { display_name: displayName },
              created_at: parsed.created_at || new Date().toISOString(),
            };
          }
        } catch {}
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    if (typeof window !== 'undefined') {
      const localStr = localStorage.getItem('velrya_user') || localStorage.getItem('user');
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (parsed && (parsed.id || parsed.email)) {
            return {
              id: parsed.id || 'demo-user-1',
              email: parsed.email || 'user@example.com',
              name: parsed.name || parsed.email?.split('@')[0] || 'User',
              created_at: parsed.created_at || new Date().toISOString(),
            };
          }
        } catch {}
      }
    }
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
