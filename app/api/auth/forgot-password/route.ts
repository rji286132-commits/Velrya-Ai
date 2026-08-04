import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const { origin } = new URL(req.url);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Direct reset - bina users table check ke, privacy safe
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || origin}/reset-password`,
    });

    if (error) {
      console.error('Reset error:', error);
      // Error hone pe bhi same message - taki email leak na ho
    }

    // Hamesha same message - privacy ke liye
    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a reset link'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: true, message: 'If your email is registered, you will receive a reset link' }
    );
  }
}
