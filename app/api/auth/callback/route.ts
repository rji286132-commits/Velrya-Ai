import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to chat page
    return NextResponse.redirect(`${origin}/chat`);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
