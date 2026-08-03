import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const hashed = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from('users')
      .update({ password_hash: hashed })
      .eq('email', cleanEmail);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
