import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPER_ADMIN_EMAIL = 'deepak21398d@gmail.com';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: existing } = await supabase.from('users').select('id').eq('email', cleanEmail).single();
    if (existing) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
    
    let role = 'user';
    if (count === 0 || cleanEmail === SUPER_ADMIN_EMAIL) {
      role = 'super_admin';
    }

    const hashed = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('users').insert({ email: cleanEmail, password_hash: hashed, role });
    
    if (error) throw error;

    return NextResponse.json({ success: true, role });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
