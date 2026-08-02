import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db/supabase'
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 12);
  const { data: user } = await supabase.from('users').insert({ email, password_hash: hashed }).select().single();
  return NextResponse.json({ user });
}
