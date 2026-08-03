import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${origin}/login?error=No code provided`);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/login?error=Auth failed`);
    }

    const user = data?.user;
    if (user?.email) {
      // Check if user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .single();

      // If user doesn't exist, create one
      if (!existingUser) {
        // Check if this is the first user (super admin)
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const role = count === 0 ? 'super_admin' : 'user';

        await supabase.from('users').insert({
          email: user.email.toLowerCase(),
          name: user.user_metadata?.full_name || user.email,
          role: role,
          password_hash: 'GOOGLE_OAUTH', // Placeholder for OAuth users
        });
      }
    }

    // Redirect to chat page
    return NextResponse.redirect(`${origin}/chat`);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${origin}/login?error=Server error`);
  }
}
