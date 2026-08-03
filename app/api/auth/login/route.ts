import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: user, error } = await supabase.from('users').select('*').eq('email', cleanEmail).single();
    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    return NextResponse.json({ success: true, role: user.role, email: user.email });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
